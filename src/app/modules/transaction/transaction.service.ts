import { Transaction } from "./transaction.model";

const viewUserHistory = async (
  userId: string,
  filter: Record<string, string>
) => {
  const { page, limit } = filter;
  const history = await Transaction.find(
    { $or: [{ fromId: userId }, { toId: userId }] },
    {
      userCharge: 1,
      transactionType: 1,
      amount: 1,
      transactionId: 1,
      status: 1,
      toPhone: 1,
    }
  )
    .sort("-createdAt")
    .populate("toId fromId")
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Transaction.countDocuments({
    $or: [{ fromId: userId }, { toId: userId }],
  });
  return { history, total };
};

const viewAgentHistory = async (userId: string) => {
  const history = await Transaction.find(
    { $or: [{ toId: userId }, { fromId: userId }] },
    {
      transactionType: 1,
      amount: 1,
      agentComission: 1,
      transactionId: 1,
      status: 1,
    }
  );
  return history;
};

const allTransactions = async () => {
  const transactions = await Transaction.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "fromId",
        foreignField: "_id",
        as: "senderInfo",
      },
    },
    {
      $unwind: {
        path: "$senderInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "toId",
        foreignField: "_id",
        as: "receiverInfo",
      },
    },
    {
      $unwind: {
        path: "$receiverInfo",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        status: 1,
        toPhone: 1,
        transactionType: 1,
        amount: 1,
        userCharge: 1,
        agentComission: 1,
        systemRevenue: 1,
        transactionId: 1,
        senderInfo: {
          _id: "$senderInfo._id",
          name: "$senderInfo.name",
          phone: "$senderInfo.phone",
          role: "$senderInfo.role",
        },
        receiverInfo: {
          _id: "$receiverInfo._id",
          name: "$receiverInfo.name",
          phone: "$receiverInfo.phone",
          role: "$receiverInfo.role",
        },
      },
    },

    {
      $limit: 10,
    },
  ]);
  return transactions;
};

export const TransactionServices = {
  viewUserHistory,
  viewAgentHistory,
  allTransactions,
};
