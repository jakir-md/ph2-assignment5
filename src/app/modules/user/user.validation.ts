import { z } from "zod";
import { Role, ISActive } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z.string({ required_error: "Name is required." }).min(2),
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
  role: z.enum(Object.values(Role) as [string]).default(Role.USER),
});

//neither ADMIN nor USER can change the isVerified field. It'll be only updated automatically if KYC is completed successfully
export const updateUserZodSchema = z.object({
  name: z.string({ required_error: "Name is required." }).min(2).optional(),
  address: z.string().min(5).optional(),
  isActive: z.enum(Object.values(ISActive) as [string]).optional(),
  isDeleted: z.boolean().optional(),
  oldPassword: z
    .string({ required_error: "Password is required" })
    .min(8)
    .regex(/^(?=.*[A-Z])/, { message: "At least one uppercase" })
    .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
      message: "At least one special character",
    })
    .regex(/(?=.*\d)/, { message: "At least one number" })
    .optional(),
  password: z
    .string({ required_error: "Password is required" })
    .min(8)
    .regex(/^(?=.*[A-Z])/, { message: "At least one uppercase" })
    .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
      message: "At least one special character",
    })
    .regex(/(?=.*\d)/, { message: "At least one number" })
    .optional(),
  oldPin: z
    .string()
    .regex(/^\d{5}$/, { message: "PIN must be exactly 5 digits." })
    .regex(/^(?!([0-9])\1{4}).*$/, {
      message: "PIN cannot have all identical digits.",
    })
    .regex(
      /^(?!(?:01234|12345|23456|34567|45678|56789|98765|87654|76543|65432|54321)).*$/,
      { message: "PIN cannot be sequential ascending or descending." }
    )
    .optional(),
  walletPin: z
    .string()
    .regex(/^\d{5}$/, { message: "PIN must be exactly 5 digits." })
    .regex(/^(?!([0-9])\1{4}).*$/, {
      message: "PIN cannot have all identical digits.",
    })
    .regex(
      /^(?!(?:01234|12345|23456|34567|45678|56789|98765|87654|76543|65432|54321)).*$/,
      { message: "PIN cannot be sequential ascending or descending." }
    )
    .optional(),
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
  address: z.string({ required_error: "User address is required." }),
  walletPin: z.string({ required_error: "Wallet Pin Must is required." }),
});
