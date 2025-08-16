import { Transaction } from "./transaction.model";

const viewUserHistory = async (userId: string) => {
  const history = await Transaction.find(
    { fromId: userId },
    { userCharge: 1, transactionType: 1, amount: 1, transactionId: 1, status: 1 }
  );
  return history;
};

const viewAgentHistory = async (userId: string) => {
  const history = await Transaction.find(
    { $or: [{ toId: userId }, { fromId: userId }] },
    { transactionType: 1, amount: 1, agentComission: 1, transactionId: 1 , status: 1}
  );
  return history;
};

export const TransactionServices = {
  viewUserHistory,
  viewAgentHistory,
};
