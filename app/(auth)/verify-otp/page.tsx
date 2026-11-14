import { FormSkeleton } from "@/components/loading/auth-skeleton";
import { OtpForm } from "@/components/otp-form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import  { Suspense } from "react";

async function VerifyOtpPageContent() {
  const session = await getSession();
 
  if (session) {
    redirect("/");
  }
  return <OtpForm />;
}

function VerfityOtpPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <VerifyOtpPageContent />
    </Suspense>
  );
}

export default VerfityOtpPage;
