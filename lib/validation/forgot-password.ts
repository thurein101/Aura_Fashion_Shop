import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});



export const forgotPasswordOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits.").regex(/^\d+$/),
});


//reset
export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().length(6).regex(/^\d+$/),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ForgotPasswordInput = z.infer<
  typeof forgotPasswordSchema
>;

export type ForgotPasswordOtpInput = z.infer<
  typeof forgotPasswordOtpSchema
>;

export type ResetPasswordInput = z.infer<
  typeof resetPasswordSchema
>;