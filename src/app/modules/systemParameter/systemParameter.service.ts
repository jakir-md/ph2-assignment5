import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import {
  ISystemParameters,
  SystemParameterStatus,
} from "./systemParameter.interface";
import { SystemParameter } from "./systemParameter.model";

const addSystemParameter = async (payload: Partial<ISystemParameters>) => {
  const isCurrentParameterExists = await SystemParameter.findOne({
    status: SystemParameterStatus.CURRENT,
  });

  if (isCurrentParameterExists) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Currently System Parameter Exists. Change it to OBSOLETE."
    );
  }

  const parameter = await SystemParameter.create(payload);
  return parameter;
};
export const SystemParameterServices = {
  addSystemParameter,
};
