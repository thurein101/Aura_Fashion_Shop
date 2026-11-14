"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";

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

import { LoginInput, loginSchema } from "@/lib/validation/auth";
import { sanitizeCallBackUrl } from "@/lib/auth/safe-redirect";
import AuthFormPanel from "./layout/auth/auth-form-panel";
import SocialAuth from "./layout/auth/social-auth-btn";
import { validateLoginCredential } from "@/app/actions/auth";
import { ErrorCodes } from "@/lib/error_code";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const rawCallBackUrl = searchParams.get("callBackUrl");
  const callBackUrl = sanitizeCallBackUrl(rawCallBackUrl);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  function onSubmit(data: LoginInput) {
    startTransition(async () => {
      const result = await validateLoginCredential(data);

      if (!result.success) {
        if (result.code === ErrorCodes.ACCOUNT_FROZEN.code) {
          form.setError("root", {
            message: result.error || "Your account is frozen. Please contact support.",
          });
          return;
        } 
        
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors && errors.length > 0) {
              form.setError(field as keyof LoginInput, {
                message: errors[0],
              });
            }
          });
          return;
        }

        if (result.error) {
          form.setError("root", {
            message: result.error,
          });
        }
        return;
      }

      if (result.data?.email) {
        const verifyOtpUrl = new URL("/verify-otp", window.location.origin);
        
        verifyOtpUrl.searchParams.set("email", result.data.email);
        verifyOtpUrl.searchParams.set("flow", "login");
        
        if (callBackUrl !== "/") {
          verifyOtpUrl.searchParams.set("callBackUrl", callBackUrl);
        }

        router.push(verifyOtpUrl.toString());
      }
    });
  }

  return (
    <AuthFormPanel
      title="Welcome Back"
      description="Enter your credentials to access your account."
      footer={
        <p className="text-stone-500 text-sm">
          Don't have an account?{" "}
          <Link
            href={`/register${rawCallBackUrl ? `?callBackUrl=${encodeURIComponent(rawCallBackUrl)}` : ""}`}
            className="text-stone-900 font-bold hover:text-orange-600 transition-colors underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      }
    >
        
      <div className="w-full max-w-sm mx-auto mt-4">
        <SocialAuth/>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-stone-900 font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
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
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-stone-900 font-semibold">Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-stone-500 hover:text-stone-900 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      disabled={isPending}
                      className="h-12 rounded-xl border-stone-200 bg-stone-50 transition-all focus:bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500 text-xs font-medium" />
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
              className="w-full h-12 rounded-full bg-stone-900 text-white font-bold uppercase tracking-widest hover:bg-stone-800 transition-all duration-300 active:scale-[0.98] text-xs mt-2"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthFormPanel>
  );
}