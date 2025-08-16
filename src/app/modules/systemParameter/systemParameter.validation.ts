import { z } from "zod";
import { SystemParameterStatus } from "./systemParameter.interface";

export const addSystemParameterValidationZodSchema = z.object({
  userCashOutCharge: z.number().min(0, "Must be a positive number"),
  userCashInCharge: z.number().min(0, "Must be a positive number"),
  userSendMoneyCharge: z.number().min(0, "Must be a positive number"),
  agentComissionForUserCashIn: z.number().min(0, "Must be a positive number"),
  agentSendMoneyCharge: z.number().min(0, "Must be a positive number"),
  agentComissionForUserCashOut: z.number().min(0, "Must be a positive number"),
  adminCashOutMargin: z.number().min(0, "Must be a positive number"),
  status: z
    .nativeEnum(SystemParameterStatus)
    .default(SystemParameterStatus.CURRENT),
});
