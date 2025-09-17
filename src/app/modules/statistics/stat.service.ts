import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";

const adminAnalyticsStat = async (year: number, quater: string) => {
  const tempMonths = quater.split(",");
  const selectedMonth = tempMonths.map((item) => parseInt(item));

  const usersCount = await User.countDocuments({ role: "USER" });
  const agentCount = await User.countDocuments({ role: "AGENT" });
  const totalTransactionsCount = await Transaction.countDocuments();
  const totalTransactionAmountQuery = await Transaction.aggregate([
    { $match: { status: "COMPLETED" } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  const totalAmount = totalTransactionAmountQuery[0]?.totalAmount || 0;
  const baseDate = new Date("2025-08-01");
  const currDate = new Date();
  const diffInMilisecond = currDate.getTime() - baseDate.getTime();
  const days = Math.floor(diffInMilisecond / (1000 * 60 * 60 * 24));
  const averageTransactionCount = Math.floor(totalTransactionsCount / days);
  const averageAmount = Math.floor(totalAmount / days);

  const quaterlyTransactions = await Transaction.aggregate([
    {
      $match: {
        status: "COMPLETED",
        createdAt: {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
        $expr: {
          $in: [{ $month: "$createdAt" }, selectedMonth],
        },
      },
    },
    {
      $facet: {
        quaterWise: [
          {
            $group: {
              _id: { month: { $month: "$createdAt" } },
              totalAmount: { $sum: "$systemRevenue" },
              count: { $sum: 1 },
            },
          },
          {
            $sort: {
              "_id.month": 1,
            },
          },
          {
            $set: { totalAmount: { $round: ["$totalAmount", 2] } },
          },
          {
            $project: {
              _id: 0,
              month: "$_id.month",
              totalAmount: 1,
            },
          },
        ],
        overAll: [
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$systemRevenue" },
            },
          },
          {
            $set: { totalAmount: { $round: ["$totalAmount", 2] } },
          },
          {
            $project: {
              _id: 0,
              totalAmount: 1,
            },
          },
        ],
      },
    },
  ]);
  return {
    subscriberInfo: [
      { subscriber: "user", total: usersCount, fill: "var(--color-user)" },
      { subscriber: "agent", total: agentCount, fill: "var(--color-agent)" },
    ],
    transactionInfo: {
      total: totalTransactionsCount,
      average: averageTransactionCount,
      totalAmount,
      averageAmount,
    },
    quaterInfo: quaterlyTransactions,
  };
};

const transactionStat = async (query: Record<string, string>) => {
  const {
    selectedUsers,
    limit,
    page,
    selectedStatus,
    selectedType,
    fromDate,
    toDate,
  } = query;

  const useableSearchTerm = query.searchTerm || "";
  const searchObject = {
    $or: ["email", "name", "address", "phone"].map((field) => ({
      [`from.${field}`]: { $regex: useableSearchTerm, $options: "i" },
    })),
  };

  //implemented transactionId wise search
  searchObject.$or.push({
    [`transactionId`]: { $regex: useableSearchTerm, $options: "i" },
  });

  //adding to
  ["email", "name", "address", "phone"].forEach((field) => {
    searchObject.$or.push({
      [`to.${field}`]: { $regex: useableSearchTerm, $options: "i" },
    });
  });

  const fromDate1 = new Date(fromDate);
  fromDate1.setDate(fromDate1.getDate() - 1);
  const toDate1 = new Date(toDate);
  const skip = (Number(page) - 1) * Number(limit);
  const statusArray = selectedStatus?.split(",") || [];
  const typeArray = selectedType?.split(",") || [];
  const usersArray = selectedUsers?.split(",") || [];
  const result = await Transaction.aggregate([
    {
      $match: {
        $and: [
          {
            status: { $in: statusArray },
            role: { $in: usersArray },
            transactionType: { $in: typeArray },
            createdAt: {
              $gte: new Date(fromDate1),
              $lte: new Date(toDate1),
            },
          },
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
    { $match: searchObject },
    {
      $facet: {
        overAll: [
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              averageAmount: { $avg: "$amount" },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              totalAmount: 1,
              averageAmount: 1,
              count: 1,
            },
          },
        ],
        byDay: [
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              totalAmount: { $sum: "$amount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
          {
            $addFields: {
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: {
                    $dateFromParts: {
                      year: "$_id.year",
                      month: "$_id.month",
                      day: "$_id.day",
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalAmount: 1,
              date: 1,
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
              systemRevenue: 1,
              userCharge: 1,
              agentComission: 1,
              transactionType: 1,
              transactionId: 1,
              createdAt: 1,
              fromPhone: "$from.phone",
              toPhone: "$to.phone",
            },
          },
        ],
      },
    },
  ]);
  return {
    overAll: result[0]?.overAll,
    byDay: result[0]?.byDay,
    transactions: result[0]?.transactions,
    totalDocuments: result[0]?.totalDocuments[0]?.count || 0,
  };
};

const agentComissionStat = async () => {
  const agentComission = await Transaction.aggregate([
    {
      $match: {
        agentComission: { $exists: true },
      },
    },
    {
      $facet: {
        quaterWise: [
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              totalAmount: { $sum: "$agentComission" },
            },
          },
          {
            $sort: { "_id.year": 1, "_id.month": 1 },
          },
          {
            $set: {
              totalAmount: { $round: ["$totalAmount", 2] },
            },
          },
          {
            $project: {
              _id: 0,
              month: "$_id.month",
              totalAmount: 1,
            },
          },
        ],
        overAll: [
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$agentComission" },
            },
          },
          {
            $set: {
              totalAmount: { $round: ["$totalAmount", 2] },
            },
          },
          {
            $project: {
              _id: 0,
              totalAmount: 1,
            },
          },
        ],
      },
    },
  ]);
  return agentComission;
};

export const StatisticsServices = {
  adminAnalyticsStat,
  transactionStat,
  agentComissionStat,
};
