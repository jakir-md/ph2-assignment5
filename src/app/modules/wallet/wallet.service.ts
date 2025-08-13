import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { Wallet } from "./wallet.model";
import { Types } from "mongoose";
import { WalletStatus } from "./wallet.interface";
import { User } from "../user/user.model";
import { SystemParameter } from "../systemParameter/systemParameter.model";
import { SystemParameterStatus } from "../systemParameter/systemParameter.interface";
import { Role } from "../user/user.interface";
import { Transaction } from "../transaction/transaction.model";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";
import { getTransactionId } from "../../utils/getTransactionId";

const createWallet = async (userId: Types.ObjectId) => {
  const isWalletExists = await Wallet.findOne({ userId });
  if (isWalletExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wallet Already Exists.");
  }
  const wallet = await Wallet.create({ userId });
  return wallet;
};

const verifyWallet = async (userId: Types.ObjectId) => {
  const isWalletExists = await Wallet.findOne({ userId });
  if (!isWalletExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wallet Doesn't Exists.");
  }

  isWalletExists.isVerified = true;
  await isWalletExists.save();
};

const getBalance = async (phone: string) => {
  const isWalletExists = await Wallet.findOne({ phone });
  if (!isWalletExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wallet Doesn't Exists.");
  }

  if (!isWalletExists.isVerified) {
    throw new AppError(StatusCodes.FORBIDDEN, "Your wallet is not verified.");
  }

  if (
    isWalletExists.status === (WalletStatus.BLOCKED || WalletStatus.SUSPENDED)
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Your Wallet is ${isWalletExists.status}`
    );
  }

  return isWalletExists.balance;
};

const addMoney = async (phone: string, amount: number) => {
  const isWalletExists = await Wallet.findOne({ phone });
  if (!isWalletExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wallet Doesn't Exists.");
  }

  isWalletExists.balance = isWalletExists.balance + amount;
  await isWalletExists.save();
  return isWalletExists.balance;
};

const cashOut = async (phone: string, amount: number, agentPhone: string) => {
  const isUserExists = await User.findOne({ phone });
  if (!isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Not Found.");
  }

  if (!isUserExists.isVerified) {
    throw new AppError(StatusCodes.FORBIDDEN, "User is not KYC Verified.");
  }

  const userWallet = await Wallet.findOne({ phone });
  if (userWallet?.status !== WalletStatus.ACTIVE) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      `User wallet is ${userWallet?.status}`
    );
  }

  const systemParameter = await SystemParameter.findOne({
    status: SystemParameterStatus.CURRENT,
  });

  if (!systemParameter) {
    throw new AppError(
      StatusCodes.SERVICE_UNAVAILABLE,
      "System Parameter not found."
    );
  }

  const cashOutChargeAmount = amount * systemParameter.userCashOutCharge;
  const userNewBalance = userWallet.balance - cashOutChargeAmount;
  const adminMarginAmount = amount * systemParameter.adminCashOutMargin;
  const agentComissionAmount = cashOutChargeAmount - adminMarginAmount;

  if (userNewBalance < 0) {
    throw new AppError(StatusCodes.FORBIDDEN, "Insufficient balance.");
  }

  const isAgentExists = await User.findOne({ phone: agentPhone });
  if (!isAgentExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Agent Not Found.");
  }

  if (!isAgentExists.isVerified) {
    throw new AppError(StatusCodes.FORBIDDEN, "Agent is not verified.");
  }

  const agentWallet = await Wallet.findOne({ phone: agentPhone });

  if (!agentWallet) {
    throw new AppError(StatusCodes.FORBIDDEN, "Agent wallet not found.");
  }

  if (agentWallet?.status !== WalletStatus.ACTIVE) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      `Agent wallet is ${userWallet?.status}`
    );
  }

  const session = await Wallet.startSession();
  session.startTransaction();

  try {
    await Wallet.findOneAndUpdate(
      { phone },
      { $inc: { balance: -(amount + cashOutChargeAmount) } },
      { runValidators: true, new: true, session }
    );

    await Wallet.findOneAndUpdate(
      { phone: agentPhone },
      {
        $inc: { balance: amount, totalComission: agentComissionAmount },
      },
      { runValidators: true, new: true, session }
    );

    await Wallet.findOneAndUpdate(
      {
        role: Role.ADMIN,
      },
      {
        $inc: {
          balance: adminMarginAmount,
        },
      },
      {
        runValidators: true,
        new: true,
        session,
      }
    );

    const newTransaction = await Transaction.create(
      [
        {
          transactionId: getTransactionId(),
          fromId: phone,
          toId: agentPhone,
          userCharge: cashOutChargeAmount,
          amount: amount,
          agentComission: agentComissionAmount,
          systemRevenue: adminMarginAmount,
          role: isUserExists.role,
          status: TransactionStatus.COMPLETED,
          transactionType: TransactionType.USER_CASH_OUT,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return newTransaction[0].transactionId;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const WalletServices = {
  createWallet,
  verifyWallet,
  getBalance,
  addMoney,
  cashOut,
};
