import { model, Schema } from "mongoose";
import { ISActive, IUser, Role } from "./user.interface";

const nameSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: nameSchema,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: { type: String, required: true, unique: true },
    picture: { type: String, default: null },
    address: { type: String, default: null },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
      default: Role.USER,
    },
    isActive: {
      type: String,
      enum: Object.values(ISActive),
      default: ISActive.ACTIVE,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      default: null,
    },
    nomineeName: {
      type: String,
      default: null
    },
    nomineeNID: {
      type: String,
      default: null
    },
    userNID: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);