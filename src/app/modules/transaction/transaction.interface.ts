import { Types } from "mongoose";
import { Role } from "../user/user.interface";

export enum TransactionType {
  USER_CASH_IN = "USER_CASH_IN",
  USER_CASH_OUT = "USER_CASH_OUT",
  USER_SEND_MONEY = "USER_SEND_MONEY",
  AGENT_SEND_MONEY = "AGENT_SEND_MONEY",
  USER_ADD_MONEY = "USER_ADD_MONEY",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REVERSED = "REVERSED",
  FAILED = "FAILED",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  role: Role;
  status: TransactionStatus;
  fromId: Types.ObjectId;
  toId: Types.ObjectId;
  toPhone: string;
  transactionType: TransactionType;
  amount: number;
  userCharge: number;
  agentComission?: number;
  systemRevenue: number;
  transactionId: string;
}