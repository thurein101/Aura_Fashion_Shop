import { FormSkeleton } from "@/components/loading/auth-skeleton";
import { LoginForm } from "@/components/Login-Form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

async function LoginPageContent() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  return <LoginForm />;
}
function LoginPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <LoginPageContent />
    </Suspense>
  );
}

export default LoginPage;
