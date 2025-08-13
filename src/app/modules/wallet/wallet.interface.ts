import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  SUSPENDED = "SUSPENDED",
  INACTIVE = "INACTIVE",
}

export interface IWallet {
  _id?: string;
  userId: Types.ObjectId;
  balance: number;
  status: WalletStatus;
  isVerified?: boolean;
  phone: string;
}
