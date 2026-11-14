"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OtpInput, otpSchema } from "@/lib/validation/auth";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { sanitizeCallBackUrl } from "@/lib/auth/safe-redirect";
import AuthFormPanel from "./layout/auth/auth-form-panel";
import {
  CompleteRegisterationVerification,
  resendRegisterationVerification,
} from "@/app/actions/auth";
import { ErrorCodes } from "@/lib/error_code";
import { emailOtp, signIn } from "@/lib/auth-client";

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) {
      setResendMessage(null);
      return;
    }
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const email = searchParams.get("email") ?? "";
  const flow = searchParams.get("flow") ?? "";
  const resumed = searchParams.get("resumed") == "true";
  const callBackUrl = sanitizeCallBackUrl(searchParams.get("callBackUrl"));
  const form = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email, //register form ဘက်က Push လိုက်တဲ့ email query stringကိုယူပီး uiမှာဖော်ပြတယ်ပေါ့
      otp: "",
    },
  });

  function onSubmit(data: OtpInput) {
    startTransition(async () => {
      if (flow === "login") {
        const { error } = await signIn.emailOtp({
          email: data.email,
          otp: data.otp,
        });

        if (error) {
          form.setError("root", {
            message: error?.message,
          });
          return;
        }
      } else {
        const result = await CompleteRegisterationVerification(data);
        if (!result.success) {
          // Field Errors
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, errors]) => {
              if (errors && errors.length > 0) {
                form.setError(field as keyof OtpInput, {
                  message: errors[0],
                });
              }
            });
          }

          // Root Error သတ်မှတ်ခြင်း
          if (result.error) {
            form.setError("root", {
              message: result.error,
            });
          }

          return;
        }
      }

      router.push(callBackUrl);
      form.setValue("otp", "");
      
    });
  }

  function HandleResendCode() {
    startTransition(async () => {
      setResendMessage(null);
      form.clearErrors("root");

      if (flow === "login") {
        const { error } = await emailOtp.sendVerificationOtp({
          email,
          type: "sign-in",
        });

        if (error) {
          form.setError("root", {
            message: error?.message,
          });

          return;
        }
        form.setValue("otp", "");

        setResendMessage("A verification code has been sent.");
        setCountdown(30);
      } else {
        const result = await resendRegisterationVerification({ email });

        if (!result.success) {
          if (result.code === ErrorCodes.ACCOUNT_FROZEN.code) {
            form.setError("root", {
              message:
                result.error ||
                "Your account is frozen. Please contact support.",
            });
            return;
          }

          // အခြား Error များအတွက် (ဥပမာ Rate limit ကျော်တာမျိုး)
          form.setError("root", {
            message: result.error || "Failed to resend code. Please try again.",
          });
          return; // Error တက်ရင် အောက်ကို ဆက်မသွားအောင် return လုပ်ပါမယ်
        }

        form.setValue("otp", "");

        setResendMessage(
          result.message ?? "A new verification code has been sent.",
        );
        setCountdown(30);
      }
    });
  }

  return (
    <AuthFormPanel
      title="Verification"
      description={`We sent a 6-digit code to ${email}. Please note that OTP codes may expire quickly.`}
      footer={
        <div className="flex flex-col items-center justify-center gap-2">
          {resendMessage && (
            <span className="text-emerald-600 text-sm font-medium">
              {resendMessage}
            </span>
          )}

          <p className="text-stone-500 text-sm">
            Didn't receive the code?{" "}
            <button
              type="button"
              className="text-stone-900 font-bold hover:text-orange-600 transition-colors cursor-pointer underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={HandleResendCode}
              disabled={isPending || countdown > 0}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
            </button>
          </p>
        </div>
      }
    >
      <div className="w-full max-w-sm mx-auto mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center space-y-4">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2 sm:gap-3 ">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className=" border-b-amber-950 h-12 w-10 sm:h-14 sm:w-12 text-lg font-bold rounded-xl border border-stone-200 bg-stone-50 transition-all focus:bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-rose-500 text-xs font-medium text-center" />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="text-rose-500 text-sm font-medium text-center bg-rose-50 p-2 rounded-md border border-rose-100">
                {form.formState.errors.root.message}
              </div>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-full bg-stone-900 text-white font-bold uppercase tracking-widest hover:bg-stone-800 transition-all duration-300 active:scale-[0.98] text-xs"
            >
              {isPending ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthFormPanel>
  );
}
