"use server"

import {
  forgotPasswordSchema,
  forgotPasswordOtpSchema,
  resetPasswordSchema,
} from "@/lib/validation/forgot-password";
import { z } from "zod";
import { auth } from "@/lib/auth";

export async function requestForgotPasswordOTP(input: {
  email: string;
}) {
  const parsed = forgotPasswordSchema.safeParse(input);

  
if (!parsed.success) {
  return {
    success: false,
    fieldErrors: z.flattenError(parsed.error).fieldErrors,
  };
}

  const normalizedEmail = parsed.data.email.toLowerCase().trim();

  try {
    await auth.api.requestPasswordResetEmailOTP({
      body: { email : normalizedEmail },
    });

    return {
      success: true,
      message:
        "If an account exists with this email, a verification code has been sent.",
    };
  } catch (error) {
    // Email ရှိ/မရှိကို Client ဘက်မှာ မဖော်ပြဘူး
    console.error("Forgot password OTP error:", error);

    return {
      success: true,
      message:
        "If an account exists with this email, a verification code has been sent.",
    };
  }
}

export async function verifyForgotPasswordOTP(input: {
  email: string;
  otp: string;
}) {
const parsed = forgotPasswordOtpSchema.safeParse(input);

if (!parsed.success) {
  return {
    success: false,
    fieldErrors: z.flattenError(parsed.error).fieldErrors,
  };
}
  try {
    await auth.api.checkVerificationOTP({
      body: {
        email: parsed.data.email.toLowerCase().trim(),
        otp: parsed.data.otp,
        type: "forget-password",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("OTP verification error:", error);

    return {
      success: false,
      error: "Invalid or expired OTP. Please try again.",
    };
  }
}

export async function resetForgottenPassword(input: {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}) {
  const parsed = resetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { email, otp, password } = parsed.data;

  try {
    await auth.api.resetPasswordEmailOTP({
      body: {
        email: email.toLowerCase().trim(),
        otp,
        password,
      },
    });

    return {
      success: true,
      message: "Your password has been reset successfully.",
    };
  } catch (error) {
    console.error("Password reset error:", error);

    return {
      success: false,
      error:
        "Unable to reset password. Your OTP may be invalid or expired.",
    };
  }
}