import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { Wallet } from "./wallet.model";
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
import { JwtPayload } from "jsonwebtoken";

const getBalance = async (phone: string) => {
  const isWalletExists = await Wallet.findOne({ phone });
  if (!isWalletExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wallet Doesn't Exists.");
  }

  if (
    isWalletExists.status === (WalletStatus.BLOCKED || WalletStatus.INACTIVE)
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Your Wallet is ${isWalletExists.status}`
    );
  }

  return isWalletExists.balance;
};

const addMoney = async (
  decodedToken: JwtPayload,
  phone: string,
  amount: number
) => {
  if (decodedToken.phone !== phone) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to add money."
    );
  }

  const isWalletExists = await Wallet.findOne({ phone }).populate("userId");
  if (!isWalletExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wallet Doesn't Exists.");
  }

  if (
    isWalletExists.status === WalletStatus.BLOCKED ||
    isWalletExists.status === WalletStatus.INACTIVE
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `User Wallet is ${isWalletExists.status}.`
    );
  }

  const session = await Wallet.startSession();
  session.startTransaction();

  try {
    await Wallet.findOneAndUpdate(
      { phone },
      {
        $inc: { balance: amount },
      },
      { runValidators: true, new: true, session }
    );

    const newTransaction = await Transaction.create({
      transactionId: getTransactionId(),
      fromId: null,
      toId: isWalletExists.userId,
      amount: amount,
      systemRevenue: 0,
      role: isWalletExists.userId.role,
      status: TransactionStatus.COMPLETED,
      transactionType:
        isWalletExists.userId.role === Role.AGENT
          ? TransactionType.AGENT_SELF_CASH_IN
          : TransactionType.USER_CASH_IN,
    });

    await session.commitTransaction();
    return { transactionId: newTransaction.transactionId, amount: amount };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const addMoneyByAgent = async (
  phone: string,
  receiverPhone: string,
  amount: number
) => {
  const agentWallet = await Wallet.findOne({ phone });

  if (!agentWallet) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Agent Wallet Not Found.");
  }

  if (agentWallet.status !== WalletStatus.ACTIVE) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Agent Wallet is ${agentWallet.status}`
    );
  }

  const isReceiverWalletExists = await Wallet.findOne({ phone: receiverPhone });

  if (!isReceiverWalletExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Wallet Not Found.");
  }

  const systemParameter = await SystemParameter.findOne({
    status: SystemParameterStatus.CURRENT,
  });

  if (!systemParameter) {
    throw new AppError(
      StatusCodes.SERVICE_UNAVAILABLE,
      "System Parameter Not Found."
    );
  }

  let agentComission = amount * systemParameter.agentComissionForUserCashIn;
  agentComission = parseFloat(agentComission.toFixed(4));
  const session = await Wallet.startSession();
  session.startTransaction();

  try {
    await Wallet.findOneAndUpdate(
      { phone },
      { $inc: { balance: -amount, totalComission: agentComission } },
      { runValidators: true, new: true, session }
    );

    await Wallet.findOneAndUpdate(
      { phone: receiverPhone },
      {
        $inc: { balance: amount },
      },
      { runValidators: true, new: true, session }
    );

    const newTransaction = await Transaction.create({
      transactionId: getTransactionId(),
      fromId: agentWallet.userId,
      toId: isReceiverWalletExists.userId,
      amount: amount,
      systemRevenue: -agentComission,
      role: Role.AGENT,
      status: TransactionStatus.COMPLETED,
      transactionType: TransactionType.USER_CASH_IN_BY_AGENT,
    });

    await session.commitTransaction();
    return { transactionId: newTransaction.transactionId, amount: amount };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const sendMoney = async (
  phone: string,
  receiverPhone: string,
  amount: number
) => {
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
      `Your wallet is ${userWallet?.status}`
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

  const sendMoneyChargeAmount =
    amount *
    (isUserExists.role === Role.USER
      ? systemParameter.userSendMoneyCharge
      : systemParameter.agentSendMoneyCharge);

  if (userWallet.balance - sendMoneyChargeAmount - amount < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient Amount.");
  }
  const isReceiverExists = await User.findOne({ phone: receiverPhone });
  if (!isReceiverExists) {
    const newTransaction = await Transaction.create({
      transactionId: getTransactionId(),
      fromId: isUserExists._id,
      toId: null,
      toPhone: receiverPhone,
      userCharge: sendMoneyChargeAmount,
      amount: amount,
      systemRevenue: 0.0,
      role: isUserExists.role,
      status: TransactionStatus.REVERSED,
      transactionType:
        isUserExists.role === Role.USER
          ? TransactionType.USER_SEND_MONEY
          : TransactionType.AGENT_SEND_MONEY,
    });

    return newTransaction;
  }

  if (isReceiverExists.role !== isUserExists.role) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `${isUserExists.role} cannot send money to ${isReceiverExists.role}`
    );
  }

  const session = await Wallet.startSession();
  session.startTransaction();

  try {
    await Wallet.findOneAndUpdate(
      { phone },
      { $inc: { balance: -(amount + sendMoneyChargeAmount) } },
      { runValidators: true, new: true, session }
    );

    await Wallet.findOneAndUpdate(
      { phone: receiverPhone },
      {
        $inc: { balance: amount },
      },
      { runValidators: true, new: true, session }
    );

    const newTransaction = await Transaction.create({
      transactionId: getTransactionId(),
      fromId: isUserExists._id,
      toId: isReceiverExists._id,
      userCharge: sendMoneyChargeAmount,
      amount: amount,
      systemRevenue: sendMoneyChargeAmount,
      role: isUserExists.role,
      status: TransactionStatus.COMPLETED,
      transactionType:
        isUserExists.role === Role.USER
          ? TransactionType.USER_SEND_MONEY
          : TransactionType.AGENT_SEND_MONEY,
    });

    await session.commitTransaction();
    return { transactionId: newTransaction.transactionId, amount: amount };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
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
  const userNewBalance = userWallet.balance - cashOutChargeAmount - amount;
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
          fromId: isUserExists._id,
          toId: isAgentExists._id,
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

    return { transactionId: newTransaction[0].transactionId, amount };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const updateStatus = async (
  decodedToken: JwtPayload,
  userId: string,
  newStatus: WalletStatus
) => {
  if (decodedToken.role !== Role.ADMIN) {
    if (decodedToken.userId !== userId) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized.");
    }
  }

  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wallet Not Found.");
  }

  if (
    wallet.status === WalletStatus.BLOCKED ||
    newStatus === WalletStatus.BLOCKED
  ) {
    if (decodedToken.role !== Role.ADMIN) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to change status."
      );
    }
  }

  wallet.status = newStatus;
  await wallet.save();
  return wallet;
};

const allWallets = async() => {
  const wallets = await Wallet.find({});
  return wallets;
}

export const WalletServices = {
  getBalance,
  addMoney,
  cashOut,
  addMoneyByAgent,
  sendMoney,
  updateStatus,
  allWallets
};
