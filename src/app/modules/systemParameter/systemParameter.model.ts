import { Schema, model } from "mongoose";
import { ISystemParameters, SystemParameterStatus } from "./systemParameter.interface";

const systemParametersSchema = new Schema<ISystemParameters>(
  {
    userCashOutCharge: { type: Number, required: true },
    userCashInCharge: { type: Number, required: true },
    userSendMoneyCharge: { type: Number, required: true },
    agentComissionForUserCashIn: { type: Number, required: true },
    agentSendMoneyCharge: {type: Number, required: true},
    agentComissionForUserCashOut: { type: Number, required: true },
    adminCashOutMargin: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(SystemParameterStatus),
      default: SystemParameterStatus.CURRENT,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const SystemParameter = model<ISystemParameters>(
  "SystemParameter",
  systemParametersSchema
);
