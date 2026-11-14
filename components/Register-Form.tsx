"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Link from "next/link";
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
import { registerSchema } from "@/lib/validation/auth";
import { RegisterInput } from "@/lib/validation/auth";
import {
  useRouter,
  useSearchParams,
} from "next/dist/client/components/navigation";
import { useTransition } from "react";
import { RegisterUser } from "@/app/actions/auth";
import AuthFormPanel from "./layout/auth/auth-form-panel";
import SocialAuth from "./layout/auth/social-auth-btn";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: RegisterInput) {
    startTransition(async () => {
      const result = await RegisterUser(data); // Backend ကို လှမ်းခေါ်တယ်

      if (!result.success) {
        // Field Errors
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors && errors.length > 0) {
              form.setError(field as keyof RegisterInput, {
                message: errors[0],
              });
            }
          });
        }

        // Global Errors -Email exists
        if (result.error) {
          form.setError("root", {
            message: result.error,
          });
        }

        return; //  Error ရှိရင် ဒီနေရာမှာတင် ရပ်လိုက်မယ် (အောက်က router.push ကို ဆက်မသွားတော့ဘူး)
      }

      const verifyOtpUrl = new URL("/verify-otp", window.location.origin);//?
      verifyOtpUrl.searchParams.set("email", result.data!.email); // it means normalizedEmail=
      verifyOtpUrl.searchParams.set("flow", "register");
      if ("resumed" in result && result.resumed) {
        verifyOtpUrl.searchParams.set("resumed", "true");
      }

      router.push(verifyOtpUrl.toString());

      // router.push(
      //     `/verify-otp?email=${encodeURIComponent(data.email)}&flow=register`,
      //   );
    });
  }

  return (
    <AuthFormPanel
      title="Create Account"
      description="Join AURA to save your favorite styles."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-stone-900 hover:text-orange-600 transition-colors underline underline-offset-4"
          >
            Login here
          </Link>
        </>
      }
    >

      <SocialAuth/>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-stone-600 font-bold text-xs uppercase tracking-wider">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jane Doe"
                    className="h-11 border-stone-200 bg-white/50 focus-visible:ring-stone-900 rounded-md transition-all text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-rose-500 text-[10px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-stone-600 font-bold text-xs uppercase tracking-wider">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jane@example.com"
                    className="h-11 border-stone-200 bg-white/50 focus-visible:ring-stone-900 rounded-md transition-all text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-rose-500 text-[10px]" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-stone-600 font-bold text-xs uppercase tracking-wider">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 border-stone-200 bg-white/50 focus-visible:ring-stone-900 rounded-md transition-all text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500 text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-stone-600 font-bold text-xs uppercase tracking-wider">
                    Confirm
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 border-stone-200 bg-white/50 focus-visible:ring-stone-900 rounded-md transition-all text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500 text-[10px]" />
                </FormItem>
              )}
            />
          </div>
          {form.formState.errors.root && (
            <div className="p-1 mb-2 text-sm text-center text-rose-500 bg-rose-50 border border-rose-200 rounded-md">
              {form.formState.errors.root.message}
            </div>
          )}
          <Button
            type="submit"
            className="w-full h-11 rounded-full bg-stone-900 text-white font-bold uppercase tracking-widest hover:bg-stone-800 transition-all duration-300 active:scale-[0.98] mt-2 text-xs"
            disabled={isPending}
          >
            {isPending ? "Creating Account..." : "Register"}
          </Button>
        </form>
      </Form>

    
      
    
      </AuthFormPanel>
  
  );
}
