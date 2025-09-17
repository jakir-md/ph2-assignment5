import z from "zod";
export const addMoneyZodSchema = z.object({
  amount: z
    .number({
      invalid_type_error: "Amount must be a number.",
      required_error: "Amount is required",
    })
    .nonnegative()
    .min(1),
  pin: z
    .string()
    .regex(/^\d{5}$/, { message: "PIN must be exactly 5 digits." })
    .regex(/^(?!([0-9])\1{4}).*$/, {
      message: "PIN cannot have all identical digits.",
    })
    .regex(
      /^(?!(?:01234|12345|23456|34567|45678|56789|98765|87654|76543|65432|54321)).*$/,
      { message: "PIN cannot be sequential ascending or descending." }
    ),
});

export const cashOutZodSchema = z.object({
  agentPhone: z
    .string({ invalid_type_error: "Phone number must be a string" })
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Phone Number",
    }),
  amount: z
    .number({
      invalid_type_error: "Amount must be a number.",
      required_error: "Amount is required",
    })
    .nonnegative()
    .min(1),
  pin: z
    .string()
    .regex(/^\d{5}$/, { message: "PIN must be exactly 5 digits." })
    .regex(/^(?!([0-9])\1{4}).*$/, {
      message: "PIN cannot have all identical digits.",
    })
    .regex(
      /^(?!(?:01234|12345|23456|34567|45678|56789|98765|87654|76543|65432|54321)).*$/,
      { message: "PIN cannot be sequential ascending or descending." }
    ),
});
