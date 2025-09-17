import { Transaction } from "./transaction.model";
import { ObjectId } from "mongodb";

const viewUserHistory = async (
  userId: string,
  filter: Record<string, string>
) => {
  const { page, limit, fromDate, toDate, selectedStatus, searchTerm } = filter;

  const statusArray = selectedStatus.split(",") || [];
  const useableSearchTerm = searchTerm || "";
  const searchObject = {
    $or: ["email", "name", "address", "phone"].map((field) => ({
      [`from.${field}`]: { $regex: useableSearchTerm, $options: "i" },
    })),
  };
  searchObject.$or.push({
    transactionId: { $regex: useableSearchTerm, $options: "i" },
  });
  ["email", "name", "address", "phone"].forEach((field) => {
    searchObject.$or.push({
      [`to.${field}`]: { $regex: useableSearchTerm, $options: "i" },
    });
  });

  const userObjectId = new ObjectId(userId);
  const skip = (Number(page) - 1) * Number(limit);
  const history = await Transaction.aggregate([
    {
      $match: {
        $and: [
          { status: { $in: statusArray } },
          { createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } },
          { $or: [{ fromId: userObjectId }, { toId: userObjectId }] },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "fromId",
        foreignField: "_id",
        as: "from",
      },
    },
    {
      $unwind: {
        path: "$from",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "toId",
        foreignField: "_id",
        as: "to",
      },
    },
    {
      $unwind: {
        path: "$to",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: searchObject,
    },
    {
      $facet: {
        transactions: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: Number(limit) },
          {
            $project: {
              _id: 1,
              amount: 1,
              status: 1,
              role: 1,
              userCharge: 1,
              agentComission: 1,
              transactionType: 1,
              transactionId: 1,
              createdAt: 1,
              fromPhone: { $ifNull: ["$from.phone", "Bank to Wallet"] },
              toPhone: "$to.phone",
            },
          },
        ],
        totalDocuments: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  return {
    transactions: history[0].transactions,
    totalDocuments: history[0].totalDocuments[0]?.count || 0,
  };
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
  allTransactions,
};
