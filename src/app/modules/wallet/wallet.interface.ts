import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  INACTIVE = "INACTIVE",
}

export interface IWallet {
  _id?: string;
  userId: Types.ObjectId;
  balance: number;
  status: WalletStatus;
  isVerified?: boolean;
  phone: string;
  totalComission: number;
}
