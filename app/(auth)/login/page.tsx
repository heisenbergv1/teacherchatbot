"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";

import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { type LoginActionState, login } from "../actions";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    }
  );

  const { update: updateSession } = useSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: router and updateSession are stable refs
  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: "Invalid credentials!",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (state.status === "success") {
      setIsSuccessful(true);
      updateSession();
      router.refresh();
    }
  }, [state.status]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

return (
  <div className="flex h-dvh w-screen items-start justify-center bg-gradient-to-b from-blue-50 via-teal-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 pt-12 md:items-center md:pt-0">
    <div className="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl bg-white/60 dark:bg-gray-800/60 shadow-lg p-6 backdrop-blur-md">
      
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
        <h3 className="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
          Sign In
        </h3>
        <p className="text-gray-600 text-sm dark:text-zinc-400">
          Use your email and password to sign in
        </p>
      </div>

      {/* Form */}
      <AuthForm action={handleSubmit} defaultEmail={email}>
        <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
        {/* Sign up prompt */}
        <p className="mt-4 text-center text-gray-600 dark:text-zinc-400 text-sm">
          {"Don't have an account? "}
          <Link
            className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 hover:underline"
            href="/register"
          >
            Sign up
          </Link>
          {" for free."}
        </p>
      </AuthForm>
    </div>
  </div>
);

}
