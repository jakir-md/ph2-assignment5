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
  const statusArray = selectedStatus.split(",");
  const typeArray = selectedType.split(",");
  const usersArray = selectedUsers.split(",");
  const result = await Transaction.aggregate([
    {
      $match: {
        status: { $in: statusArray },
        role: { $in: usersArray },
        transactionType: { $in: typeArray },
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      },
    },
  ]);
  return result;
};
export const StatisticsServices = { adminAnalyticsStat, transactionStat };
