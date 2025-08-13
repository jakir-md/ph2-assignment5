import { Schema, model } from "mongoose";
import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface";
import { Role } from "../user/user.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
    },
    fromId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toId: {
      type: Schema.Types.ObjectId,
      ref : "User",
      required: true
    },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    userCharge : {
      type: Number,
      required: true,
    },
    agentComission: {
      type: Number,
    },
    systemRevenue: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
