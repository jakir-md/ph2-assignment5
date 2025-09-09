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
      $project: {
        _id: 0,
        month: "$_id.month",
        totalAmount: 1,
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

const transactionStat = async (query) => {
  const { selectedUsers, selectedStatus, selectedType, fromDate, toDate } =
    query;

  const useableSearchTerm = query.searchTerm || "";
  const searchObject = {
    $or: ["email", "name", "address", "phone"].map((field) => ({
      [`from.${field}`]: { $regex: useableSearchTerm, $options: "i" },
    })),
  };

  //implemented transactionId wise search
  searchObject.$or.push({ transactionId: useableSearchTerm });

  //adding to
  ["email", "name", "address", "phone"].forEach((field) => {
    searchObject.$or.push({
      [`to.${field}`]: { $regex: useableSearchTerm, $options: "i" },
    });
  });

  
  const fromDate1 = new Date(fromDate);
  const toDate1 = new Date(toDate);
  const statusArray = selectedStatus.split(",");
  const typeArray = selectedType.split(",");
  const usersArray = selectedUsers.split(",");
  const result = await Transaction.aggregate([
    {
      $match: {
        $and: [
          {
            status: { $in: statusArray },
            role: { $in: usersArray },
            transactionType: { $in: typeArray },
            createdAt: {
              $gte: fromDate1,
              $lte: toDate1,
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
        transactions: [
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
          { $sort: { createdAt: 1 } },
        ],
      },
    },
  ]);
  return result;
};
export const StatisticsServices = { adminAnalyticsStat, transactionStat };
