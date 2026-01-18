import ConfirmPassword from "@/components/common/forgetPassword/ConfirmPassword";
import { Suspense } from "react";

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <ConfirmPassword />
    </Suspense>
  );
}
