import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be less than 50 characters."),
    
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
    
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(32, "Password must be less than 32 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)."),
    
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const otpSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  otp: z.string().length(6, {
    message: "OTP code must be exactly 6 digits.",
  }),
});

export const emailSchema = z.object({
  email: z
    .string( "Email is required." )
    .trim()
    .email({ message: "Please enter a valid email address." })
    .toLowerCase(),
});

export const loginSchema = z.object({
  email: z
    .string("Email is required." )
    .trim()
    .email({ message: "Please enter a valid email address." })
    .toLowerCase(),
  password: z
    .string("Password is required." )
    .min(1, { message: "Password cannot be empty." }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;