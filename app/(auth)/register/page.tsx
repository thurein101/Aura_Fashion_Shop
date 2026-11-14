import { RegisterForm } from "@/components/Register-Form";
import { getSession } from "@/lib/session";
import { redirect } from "next/dist/client/components/navigation";
import { Suspense } from "react";
import {FormSkeleton } from "@/components/loading/auth-skeleton";

async function RegisterPageContent() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  return <RegisterForm />;
}
function RegisterPage() {
  return (
    <Suspense fallback={<FormSkeleton/>}>
      <RegisterPageContent />
    </Suspense>
  );
}

export default RegisterPage;
