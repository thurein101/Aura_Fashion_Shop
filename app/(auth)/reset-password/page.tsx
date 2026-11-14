import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { FormSkeleton } from "@/components/loading/auth-skeleton";
import { ResetPasswordForm } from "@/components/Reset-Password-Form";

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

async function ResetPasswordPageContent() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  return <ResetPasswordForm />;
}
function ResetPasswordPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

export default ResetPasswordPage;
