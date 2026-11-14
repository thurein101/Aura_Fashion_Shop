import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { FormSkeleton } from "@/components/loading/auth-skeleton";

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

async function ForgotPasswordPageContent() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  return <ForgotPasswordForm />;
}
function ForgotPasswordPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}

export default ForgotPasswordPage;
