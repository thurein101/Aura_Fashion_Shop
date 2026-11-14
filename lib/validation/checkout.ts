
import { z } from "zod";

export const checkoutSchema = z.object({
  address: z
    .string()
    .trim()
    .min(10, "Please enter a complete address.")
    .max(500, "Address is too long."),

  contactNumber: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20, "Phone number is too long.")
    .regex(
      /^\+?[0-9\s\-()]+$/,
      "Invalid phone number."
    ),

  paymentMethod: z.enum([
    "CASH_ON_DELIVERY",
    "CREDIT_CARD",
  ]),
});

export type CheckoutInput = z.infer<
  typeof checkoutSchema
>;
