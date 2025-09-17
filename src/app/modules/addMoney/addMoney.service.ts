import { TransactionStatus } from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";
import { Wallet } from "../wallet/wallet.model";

const successAddMoney = async (query: Record<string, string>) => {
  const amount = Number(query.amount);
  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    await Wallet.findOneAndUpdate(
      { phone: query.phone },
      { $inc: { balance: amount } },
      { runValidators: true, session, new: true }
    );

    await Transaction.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: TransactionStatus.COMPLETED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    return { success: true, message: "Money Added successfully." };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const failedAddMoney = async (query: Record<string, string>) => {
  await Transaction.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: TransactionStatus.FAILED },
    { runValidators: true }
  );
  return { success: false, message: "Transaction Failed." };
};

export const AddMoneyServices = {
  successAddMoney,
  failedAddMoney,
};
