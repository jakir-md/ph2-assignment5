import { z } from "zod";
import { Role, ISActive } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z.object({
    firstName: z.string({ required_error: "First Name is required." }).min(1),
    lastName: z.string().optional(),
  }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8)
    .regex(/^(?=.*[A-Z])/, { message: "At least one uppercase" })
    .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
      message: "At least one special character",
    })
    .regex(/(?=.*\d)/, { message: "At least one number" }),
  phone: z
    .string({ invalid_type_error: "Phone number must be a string" })
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Phone Number",
    }),
  picture: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(Object.values(Role) as [string]).default(Role.USER),
});

export const updateUserZodSchema = z.object({
  name: z
    .object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
    })
    .optional(),
  address: z.string().optional(),
  isActive: z.enum(Object.values(ISActive) as [string]).optional(),
  isDeleted: z.boolean().optional(),
  password: z
    .string({ required_error: "Password is required" })
    .min(8)
    .regex(/^(?=.*[A-Z])/, { message: "At least one uppercase" })
    .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
      message: "At least one special character",
    })
    .regex(/(?=.*\d)/, { message: "At least one number" }),
});

export const verifyWithKYCZodSchema = z.object({
  nomineeName: z
    .string({ required_error: "Nominee First Name is required." })
    .min(1),
  nomineeNID: z
    .string({ required_error: "Nominee NID is required." })
    .min(10)
    .max(10),
  userNID: z
    .string({ required_error: "User NID is required." })
    .min(10)
    .max(10),
  picture: z.string({ required_error: "User photo is required." }),
  address: z.string({ required_error: "User address is required." }),
});
