import z from "zod";
export const addMoneyZodSchema = z.object({
  amount: z
    .number({
      invalid_type_error: "Amount must be a number.",
      required_error: "Amount is required",
    })
    .nonnegative()
    .min(1),
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
});
