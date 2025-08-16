import { Types } from "mongoose";
import { Role } from "../user/user.interface";

export enum TransactionType {
  USER_CASH_IN = "USER_CASH_IN",
  USER_CASH_OUT = "USER_CASH_OUT",
  USER_SEND_MONEY = "USER_SEND_MONEY",
  AGENT_SELF_CASH_IN = "AGENT_SELF_CASH_IN",
  AGENT_SEND_MONEY = "AGENT_SEND_MONEY",
  AGENT_CASH_OUT_COMISSION = "AGENT_CASH_OUT_COMISSION",
  ADMIN_CASH_OUT_COMISSION = "ADMIN_CASH_OUT_COMISSION",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REVERSED = "REVERSED",
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
