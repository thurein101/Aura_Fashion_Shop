
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import AuthFormPanel from "@/components/layout/auth/auth-form-panel";

import {
  forgotPasswordOtpSchema,
  resetPasswordSchema,
  ForgotPasswordOtpInput,
  ResetPasswordInput,
} from "@/lib/validation/forgot-password";

import {
  requestForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetForgottenPassword,
} from "@/app/actions/forgot-password";

type ResetStep = "otp" | "password";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email")?.trim().toLowerCase() ?? "";

  const [step, setStep] = useState<ResetStep>("otp");
  const [countdown, setCountdown] = useState(0);
  const [isPending, startTransition] = useTransition();

  // OTP Form
  const otpForm = useForm<ForgotPasswordOtpInput>({
    resolver: zodResolver(forgotPasswordOtpSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });

  // New Password Form
  const passwordForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Resend Countdown
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  //Verify OTP
  function onVerifyOTP(data: ForgotPasswordOtpInput) {
    otpForm.clearErrors();

    startTransition(async () => {
      const result = await verifyForgotPasswordOTP(data);

      if (!result.success) {
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors?.length) {
              otpForm.setError(field as keyof ForgotPasswordOtpInput, {
                type: "server",
                message: errors[0],
              });
            }
          });
          return;
        }

        otpForm.setError("root", {
          type: "server",
          message: result.error || "Invalid or expired OTP.",
        });
        return;
      }

      // Pass verified data to the password form
      passwordForm.setValue("email", data.email);
      passwordForm.setValue("otp", data.otp);

      setStep("password");
    });
  }

  //  Reset Password
  function onResetPassword(data: ResetPasswordInput) {
    passwordForm.clearErrors();

    startTransition(async () => {
      const result = await resetForgottenPassword(data);

      if (!result.success) {
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors?.length) {
              passwordForm.setError(field as keyof ResetPasswordInput, {
                type: "server",
                message: errors[0],
              });
            }
          });
          return;
        }

        passwordForm.setError("root", {
          type: "server",
          message: result.error || "Unable to reset password.",
        });
        return;
      }

      router.replace("/login?passwordReset=true");
    });
  }

  // RESEND OTP
  function onResendOTP() {
    otpForm.clearErrors();

    startTransition(async () => {
      const result = await requestForgotPasswordOTP({ email });

      if (!result.success) {
        otpForm.setError("root", {
          type: "server",
          message: result.message || "Unable to resend OTP.",
        });
        return;
      }

      otpForm.setValue("otp", "");
      setCountdown(30);
    });
  }

  // Missing Email
  if (!email) {
    return (
      <AuthFormPanel
        title="Invalid Request"
        description="Your email address is missing. Please start the password reset process again."
        footer={
          <Link href="/forgot-password" className="font-bold underline">
            Try again
          </Link>
        }
      >
        <></>
      </AuthFormPanel>
    );
  }

  return (
    <AuthFormPanel
      title={step === "otp" ? "Verify Your Email" : "Create New Password"}
      description={
        step === "otp"
          ? `Enter the 6-digit verification code sent to ${email}.`
          : "Your email has been verified. Please create a new password."
      }
      footer={
        <p className="text-stone-500 text-sm">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-stone-900 font-bold hover:text-orange-600 underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="w-full max-w-sm mx-auto mt-4">

        {/*OTP VERIFICATION */}
        {step === "otp" && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onVerifyOTP)}
              className="space-y-6"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-4">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                      >
                        <InputOTPGroup className="gap-2 sm:gap-3">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="h-12 w-10 sm:h-14 sm:w-12 text-lg font-bold rounded-xl border border-stone-200 bg-stone-50 transition-all focus:bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>

                    <FormMessage className="text-rose-500 text-xs font-medium text-center" />
                  </FormItem>
                )}
              />

              {/* Root Error */}
              {otpForm.formState.errors.root && (
                <div className="text-rose-500 text-sm font-medium text-center bg-rose-50 p-2 rounded-md border border-rose-100">
                  {otpForm.formState.errors.root.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 rounded-full bg-stone-900 text-white font-bold uppercase tracking-widest hover:bg-stone-800 transition-all duration-300 active:scale-[0.98] text-xs"
              >
                {isPending ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center text-sm text-stone-500">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={onResendOTP}
                  disabled={isPending || countdown > 0}
                  className="text-stone-900 font-bold underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {countdown > 0
                    ? `Resend in ${countdown}s`
                    : "Resend Code"}
                </button>
              </div>
            </form>
          </Form>
        )}

        {/*  NEW PASSWORD */}
        {step === "password" && (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onResetPassword)}
              className="space-y-5"
            >
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-stone-900 font-semibold">
                      New Password
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        disabled={isPending}
                        className="h-12 rounded-xl border-stone-200 bg-stone-50 transition-all focus:bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-rose-500 text-xs font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-stone-900 font-semibold">
                      Confirm New Password
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        disabled={isPending}
                        className="h-12 rounded-xl border-stone-200 bg-stone-50 transition-all focus:bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-rose-500 text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Root */}
              {passwordForm.formState.errors.root && (
                <div className="text-rose-500 text-sm font-medium text-center bg-rose-50 p-2 rounded-md border border-rose-100">
                  {passwordForm.formState.errors.root.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 rounded-full bg-stone-900 text-white font-bold uppercase tracking-widest hover:bg-stone-800 transition-all duration-300 active:scale-[0.98] text-xs"
              >
                {isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </AuthFormPanel>
  );
}
