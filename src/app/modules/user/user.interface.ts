import { Types } from "mongoose";

export enum Role {
    ADMIN="ADMIN",
    AGENT="AGENT",
    USER="USER"
}

export enum ISActive {
    ACTIVE="ACTIVE",
    BLOCKED="BLOCKED",
    INACTIVE="INACTIVE",
    SUSPENDED="SUSPENDED"
}

export interface IUser {
    _id?:Types.ObjectId;
    name:string;
    email:string;
    password:string;
    role: Role;
    picture?:string;
    address?:string;
    phone:string;
    userNID?:string;
    walletPin?:string;
    nomineeName?:string;
    nomineeNID?:string;
    isDeleted?: boolean;
    isActive?: ISActive;
    isVerified?: boolean;
    createdAt?:Date;
    walletId?:Types.ObjectId;
}