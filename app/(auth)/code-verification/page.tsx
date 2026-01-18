import VerificationCode from "@/components/common/forgetPassword/VerificationCode";
import { Suspense } from "react";

export default function CodeVerificationPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <VerificationCode />
    </Suspense>
  );
}
