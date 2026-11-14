"use server";

import {
  emailSchema,
  LoginInput,
  loginSchema,
  OtpInput,
  otpSchema,
  RegisterInput,
  registerSchema,
} from "@/lib/validation/auth";
import { email, success, z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth";
import { ErrorCodes } from "@/lib/error_code";
import { isAdminRole } from "@/lib/auth/role";
import {
  applyPendingRegisteration,
  upsertPendingRegisteration,
} from "@/lib/auth/pending-registeration";

export async function RegisterUser(data: RegisterInput) {
  //လုံခြုံအောင် data fieldကို validation လုပ်တယ်
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { fullName, email, password } = parsed.data; //ဖြည်ချလိုက်တယ်

  const normalizedEmail = email.toLowerCase();

  //queryနဲ့ခိုင်းတယ်
  const ExistingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      id: true,
      emailVerified: true,
      role: true,
      isFrozen: true,
    },
  });

  //Checking for existing user and their status
  if (ExistingUser && ExistingUser?.isFrozen) {
    return {
      success: false,
      error: ErrorCodes.ACCOUNT_FROZEN.message,
      code: ErrorCodes.ACCOUNT_FROZEN.code,
    };
  }

  if (ExistingUser && isAdminRole(ExistingUser?.role)) {
    //Role အမျိုး"ရှိနိုင်လို့
    return {
      success: false,
      error: ErrorCodes.ADMIN_ACCOUNT.message,
      code: ErrorCodes.ADMIN_ACCOUNT.code,
    };
  }

  if (ExistingUser && ExistingUser?.emailVerified) {
    return {
      success: false,
      error: ErrorCodes.EMAIL_ALREADY_EXISTS.message,
      code: ErrorCodes.EMAIL_ALREADY_EXISTS.code,
    };
  }

  if (ExistingUser && !ExistingUser?.emailVerified) {
    //pending registeration tableထဲရောက်လာရတဲ့အခြေအနေ
    try {
      await upsertPendingRegisteration(normalizedEmail, fullName, password);
      await auth.api.sendVerificationOTP({
        body: {
          email: normalizedEmail,
          type: "email-verification",
        },
        headers: await headers(),
      });
    } catch (err) {
      return {
        success: false,
        error: "Failed to upsert pending registration. Please try again later.",
      };
    }
    return {
      success: true,
      data: { email: normalizedEmail },
      resumed: true,
    };
  }

  // Sign Up
  try {
    await auth.api.signUpEmail({
      body: {
        name: fullName, // these mean data.fullName, data.email, data.password
        email: normalizedEmail,
        password,
      },
      headers: await headers(),
    });
  } catch (err) {
    const message =
      err instanceof APIError
        ? err.message
        : "Failed to register. Please try again later.";
    console.error("Register failed:", message);
    return { success: false, error: message };
  }
  //OTP
  try {
    await auth.api.sendVerificationOTP({
      body: {
        email: normalizedEmail,
        type: "email-verification",
      },
      headers: await headers(),
    });
  } catch (err) {
    const message =
      err instanceof APIError
        ? err.message
        : "Failed to send verification email. Please try again later.";
    console.error("Sending verification OTP failed:", message);
    return { success: false, error: message };
  }

  return { success: true, data: { email: normalizedEmail } };
  // sign up,otp လုပ်ဆောင်ချက်တွေကိုserverကပဲလုပ်ဆောင်မှာဖြစ်ပြီး email တခုပဲ data အနေနဲ့ return
  // ပြန်ရတာက urlကြောင့်လို့ထင်မြင်မိပါတယ်
}

export async function CompleteRegisterationVerification(input: OtpInput) {
  const parsed = otpSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const { email, otp } = parsed.data;

  const normalizedEmail = email.toLowerCase();

  try {
    await auth.api.verifyEmailOTP({
      //ထုးခြား
      body: {
        email: normalizedEmail,
        otp,
      },
      headers: await headers(),
    });

    //ဝင်လာတဲ့လူတွေမှာ အသစ် register လုပ်တဲ့လူဖြစ်နိုင်သလို pendingတဝက်တပြတ်ဖြစ်နေတဲ့လူလဲဖြစ်နိုင်ပါတယ်
    //လုပ်မဲ့ပုံက new userဆို verified true လိုက်မယ်, pending userဖြစ်နေတယ်ဆိုလဲ trueမယ် pending tableထဲကပါဖျက်ရမယ်
    //expireကျော်ရင်ကောပဲ go with db transcation
    const pendingResult = await applyPendingRegisteration(normalizedEmail);

    if (!pendingResult.success && pendingResult.error === "EXPIRED") {
      return {
        success: false,
        error: "Your registration session has expired. Please register again.",
      };
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof APIError ? err.message : "Failed to verify OTP.";

    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("invalid") ||
      lowerMessage.includes("incorrect")
    ) {
      return { success: false, error: "Invalid OTP code. Please try again." };
    }

    if (lowerMessage.includes("expired")) {
      return {
        success: false,
        error: "OTP has expired. Please request a new one.",
      };
    }

    if (
      lowerMessage.includes("too many attempts") ||
      lowerMessage.includes("rate limit")
    ) {
      return {
        success: false,
        error: "Too many attempts. Please try again later.",
      };
    }

    return { success: false, error: message };
  }
}

export async function resendRegisterationVerification(input: {
  email: string;
}) {
  const parsed = emailSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const normalizedEmail = input.email.toLowerCase();

  const ExistingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      id: true,
      emailVerified: true,
      role: true,
      isFrozen: true,
    },
  });

  if (ExistingUser && ExistingUser?.isFrozen) {
    return {
      success: false,
      error: ErrorCodes.ACCOUNT_FROZEN.message,
      code: ErrorCodes.ACCOUNT_FROZEN.code,
    };
  }

  if (ExistingUser && isAdminRole(ExistingUser?.role)) {
    //Role အမျိုး"ရှိနိုင်လို့
    return {
      success: false,
      error: ErrorCodes.ADMIN_ACCOUNT.message,
      code: ErrorCodes.ADMIN_ACCOUNT.code,
    };
  }
//verified ဖြစ်ပြီးသား acc ကိုဘလိုနည်းနဲ့များ ထပ်ပေးနေရအကြောင်းမရှိ
  if (ExistingUser && ExistingUser?.emailVerified) {
    return {
      success: false,
      error: ErrorCodes.EMAIL_ALREADY_EXISTS.message,
      code: ErrorCodes.EMAIL_ALREADY_EXISTS.code,
    };
  }

  try {
    await auth.api.sendVerificationOTP({
      body: {
        email: normalizedEmail,
        type: "email-verification",
      },
      headers: await headers(),
    });
  } catch (err) {
    const message =
      err instanceof APIError
        ? err.message
        : "Failed to send verification email. Please try again later.";
    console.error("Sending verification OTP failed:", message);
    return { success: false, error: message };
  }

  return {
    success: true,
    data: { email: normalizedEmail },
    message: "Verification Successful",
  };
}

export async function validateLoginCredential(data: LoginInput) {
  
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  
  const ExistingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      role: true,
      isFrozen: true, // Frozen ကိုပါ ယူထားသင့်ပါတယ်
    },
  });

 
  if (!ExistingUser) {
    return {
      success: false,
      error: "Invalid email or password.", 
    };
  }


  if (ExistingUser.isFrozen) {
    return {
      success: false,
      error: ErrorCodes.ACCOUNT_FROZEN.message,
      code: ErrorCodes.ACCOUNT_FROZEN.code,
    };
  }


  if (isAdminRole(ExistingUser.role)) {
    return {
      success: false,
      error: ErrorCodes.ADMIN_ACCOUNT.message,
      code: ErrorCodes.ADMIN_ACCOUNT.code,
    };
  }


  try {
    const signInResponse = await auth.api.signInEmail({
      body: {
        email: normalizedEmail,
        password,
      },
      headers: await headers(),
    });

    if (!signInResponse) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    // Password မှန်ကန်ပါက ယာယီ Session ကို ပြန်ဖျက်ပါမည် (OTP စစ်ပြီးမှသာ အစစ်ဝင်စေရန်)
    await auth.api.signOut({
      headers: await headers(),
    });

    // Sign-in အတွက် OTP ပို့ပါမည်
    await auth.api.sendVerificationOTP({
      body: {
        email: normalizedEmail,
        type: "sign-in", // Better-Auth
      },
      headers: await headers(),
    });

   
    return {
      success: true,
      data: { email: normalizedEmail },
      message: "Please enter the OTP sent to your email.",
    };

  } catch (err) {
 
    const message = err instanceof APIError ? err.message : "Failed to validate credentials.";
    
    
    if (message.toLowerCase().includes("invalid password")) {
      return { success: false, error: "Invalid email or password." };
    }
    
    return { success: false, error: message };
  }
}
