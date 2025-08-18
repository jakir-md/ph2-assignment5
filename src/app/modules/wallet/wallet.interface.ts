import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  INACTIVE = "INACTIVE",
}

export interface IWallet {
  _id?: string;
  userId: Types.ObjectId | IUser;
  balance: number;
  status: WalletStatus;
  isVerified?: boolean;
  phone: string;
  totalComission: number;
}
