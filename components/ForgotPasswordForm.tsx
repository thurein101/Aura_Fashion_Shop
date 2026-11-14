
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

import AuthFormPanel from "@/components/layout/auth/auth-form-panel";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validation/forgot-password";
import { requestForgotPasswordOTP } from "@/app/actions/forgot-password";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: ForgotPasswordInput) {
    // အရင် Error တွေကို ရှင်း
    form.clearErrors();

    startTransition(async () => {
      const result = await requestForgotPasswordOTP(data);

      if (!result.success) {
        // Server-side field errors
        if ("fieldErrors" in result && result.fieldErrors) {
          Object.entries(result.fieldErrors as Record<string, string[] | undefined>).forEach(
            ([field, errors]) => {
              if (Array.isArray(errors) && errors.length > 0) {
                form.setError(field as keyof ForgotPasswordInput, {
                  type: "server",
                  message: errors[0],
                });
              }
            }
          );
          return;
        }

        // General server error
        form.setError("root", {
          type: "server",
          message: result.message || "Something went wrong. Please try again.",
        });

        return;
      }

      // Email ကို URL ထဲထည့်ပြီး OTP Page သို့သွားမယ်
      const resetUrl = new URL("/reset-password", window.location.origin);
      resetUrl.searchParams.set("email", data.email.toLowerCase().trim());

      router.push(resetUrl.toString());
    });
  }

  return (
    <AuthFormPanel
      title="Forgot Password?"
      description="Enter your email address and we'll send you a verification code."
      footer={
        <p className="text-stone-500 text-sm">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-stone-900 font-bold hover:text-orange-600 transition-colors underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="w-full max-w-sm mx-auto mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-stone-900 font-semibold">
                    Email
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      disabled={isPending}
                      className="h-12 rounded-xl border-stone-200 bg-stone-50 transition-all focus:bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-rose-500 text-xs font-medium" />
                </FormItem>
              )}
            />

            {/* Root  */}
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
              {isPending ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthFormPanel>
  );
}
