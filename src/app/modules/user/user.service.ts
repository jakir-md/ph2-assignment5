/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { ISActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { EnvVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";
import { QueryBuilder } from "../../utils/QueryBuilder";

const registerUser = async (payload: Partial<IUser>) => {
  const { phone, password } = payload;
  const isUserExists = await User.findOne({ phone });
  if (isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exists.");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(EnvVars.BCRYPT_SALT_ROUND)
  );
  payload.password = hashedPassword;

  const session = await User.startSession();
  session.startTransaction();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let user: any = await User.create([{ ...payload }], { session });
    if (payload.role === Role.USER || payload.role === Role.AGENT) {
      const wallet = await Wallet.create(
        [{ userId: user[0]._id, phone: user[0].phone }],
        {
          session,
        }
      );
      const updatedUser = await User.findByIdAndUpdate(
        user[0]._id,
        { walletId: wallet[0]._id },
        { runValidators: true, new: true, session }
      );
      user = updatedUser;
    }

    await session.commitTransaction();
    const total = await User.countDocuments();

    const { password, ...rest } = user.toObject();
    return { rest, total };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const updateUserInfo = async (
  payload: Partial<IUser> & {
    oldPassword: string;
    password: string;
    oldPin: string;
    walletPin: string;
  },
  decodedToken: JwtPayload,
  userId: string
) => {
  //checking whether one is trying to update others info except admin
  if (decodedToken.role !== Role.ADMIN) {
    if (userId !== decodedToken.userId) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to update the content."
      );
    }
  }

  const isUserExists = await User.findById(userId);
  if (!isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Not Found.");
  }

  if (payload.role) {
    throw new AppError(StatusCodes.FORBIDDEN, "User Role Cannot be changed.");
  }

  if (decodedToken.role !== Role.ADMIN) {
    if (
      "isVerified" in payload ||
      "isDeleted" in payload ||
      "isActive" in payload
    ) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to update the to content."
      );
    }
  }

  if (payload.oldPassword) {
    const match = await bcrypt.compare(
      payload.oldPassword,
      isUserExists.password as string
    );

    if (!match) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Old Password Doesn't match."
      );
    }

    payload.password = await bcrypt.hash(
      payload.password,
      Number(EnvVars.BCRYPT_SALT_ROUND)
    );
  }

  if (payload.oldPin) {
    const match = await bcrypt.compare(
      payload.oldPin,
      isUserExists.walletPin as string
    );

    if (!match) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Old Pin Doesn't match.");
    }

    payload.walletPin = await bcrypt.hash(
      payload.walletPin,
      Number(EnvVars.BCRYPT_SALT_ROUND)
    );
  }

  const { oldPassword, oldPin, ...filteredPayload } = payload;
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    filteredPayload,
    {
      runValidators: true,
      new: true,
    }
  ).orFail();

  const { password, walletPin, ...rest } = updatedUser.toObject();

  return rest;
};

const verifyWithKYC = async (
  decodedToken: JwtPayload,
  userId: string,
  payload: Partial<IUser>
) => {
  //checking whether one is trying to update others info except admin
  if (userId !== decodedToken.userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to update the content."
    );
  }

  const isUserExits = await User.findById(userId).lean();
  if (!isUserExits) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Not Found.");
  }

  if (isUserExits.isVerified) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "To reset your KYC information contact admin."
    );
  }

  if (isUserExits.walletId === null) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Your Wallet Not Found. Please contact with Admin."
    );
  }

  if (isUserExits.isDeleted || isUserExits.isActive === ISActive.INACTIVE) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cannot perform KYC. User is deleted or INACTIVE."
    );
  }

  if (payload.userNID) {
    const isUserNIDExists = await User.findOne({ userNID: payload.userNID });

    if (isUserNIDExists) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User NID Already Exists.");
    }
  }

  payload.walletPin = await bcrypt.hash(
    payload.walletPin as string,
    Number(EnvVars.BCRYPT_SALT_ROUND)
  );

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { ...payload },
    { runValidators: true, new: true }
  ).orFail();

  updatedUser.isVerified = true;
  await updatedUser.save();

  return true;
};

const getUsersAndWallet = async () => {
  const usersWithWallet = await User.aggregate([
    {
      $lookup: {
        from: "wallets",
        localField: "walletId",
        foreignField: "_id",
        as: "walletInfo",
      },
    },
    {
      $unwind: { path: "$walletInfo", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        name: 1,
        phone: 1,
        isVerified: 1,
        isDeleted: 1,
        isActive: 1,
        role: 1,
        address: 1,
        createdAt: 1,
        "walletInfo._id": 1,
        "walletInfo.balance": 1,
        "walletInfo.status": 1,
        "walletInfo.totalComission": 1,
        "walletInfo.createdAt": 1,
      },
    },
    {
      $limit: 10,
    },
  ]);
  return usersWithWallet;
};

const getMe = async (email: string, phone: string) => {
  const user = await User.findOne({
    $or: [{ email }, { phone }],
  })
    .populate("walletId")
    .select("-password");

  return user;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const users = queryBuilder
    .populate()
    .search(["name", "phone", "email", "userNID", "nomineeNID", "address"])
    .filter()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);
  return { data, meta };
};

export const UserServices = {
  registerUser,
  updateUserInfo,
  verifyWithKYC,
  getUsersAndWallet,
  getMe,
  getAllUsers,
};
