import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { ISActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { EnvVars } from "../../config/env";
import { WalletServices } from "../wallet/wallet.service";
import { JwtPayload } from "jsonwebtoken";

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
    let user = await User.create(payload);
    if (payload.role === (Role.USER || Role.AGENT)) {
      const wallet = await WalletServices.createWallet(user._id);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { walletId: wallet._id },
        { runValidators: true, new: true, session }
      );
      user = updatedUser;
    }
    const total = await User.countDocuments();

    await session.commitTransaction();

    return { user, total };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const verifyUser = async (userId: string) => {
  const isUserExits = await User.findById(userId);
  if (!isUserExits) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Not Found.");
  }

  if (isUserExits.walletId === null) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Wallet Not Found.");
  }
  if (
    isUserExits.userNID === null ||
    isUserExits.nomineeNID === null ||
    isUserExits.nomineeName === null ||
    isUserExits.address === null ||
    isUserExits.isDeleted === true ||
    isUserExits.isActive === ISActive.INACTIVE
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Update Profile info for verification."
    );
  }

  isUserExits.isVerified = true;
  await isUserExits.save();

  await WalletServices.verifyWallet(isUserExits._id);
  return isUserExits;
};

const updateUserInfo = async (
  payload: Partial<IUser>,
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
      payload.isVerified ||
      !payload.isVerified ||
      payload.isDeleted ||
      !payload.isDeleted ||
      payload.isActive
    ) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to update the content."
      );
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    runValidators: true,
    new: true,
  });

  return updatedUser;
};
export const UserServices = {
  registerUser,
  verifyUser,
  updateUserInfo,
};
