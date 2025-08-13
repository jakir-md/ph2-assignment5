export enum SystemParameterStatus {
  CURRENT = "CURRENT",
  OBSOLETED = "OBSOLETED",
}

export interface ISystemParameters {
  userCashOutCharge: number;
  userCashInCharge: number;
  userSendMoneyCharge: number;
  agentComissionForUserCashIn: number;
  agentSendMoneyCharge: number;
  agentComissionForUserCashOut: number;
  adminCashOutMargin: number;
  status: SystemParameterStatus
}
