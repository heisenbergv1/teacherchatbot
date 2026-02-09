"use client";

import { useFormStatus } from "react-dom";
import { LoaderIcon } from "@/components/icons";
import { Button } from "./ui/button";

export function SubmitButton({
  children,
  isSuccessful,
}: {
  children: React.ReactNode;
  isSuccessful: boolean;
}) {
  const { pending } = useFormStatus();
  const disabled = pending || isSuccessful;

  return (
    <Button
      type={disabled ? "button" : "submit"}
      disabled={disabled}
      aria-disabled={disabled}
      className="relative w-full h-10 rounded-lg
                 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400
                 text-white font-medium shadow-md hover:shadow-lg
                 transition-all duration-300 transform hover:-translate-y-0.5
                 active:scale-95"
    >
      {children}

      {disabled && (
        <span className="absolute right-4 animate-spin">
          <LoaderIcon />
        </span>
      )}

      <output aria-live="polite" className="sr-only">
        {disabled ? "Loading" : "Submit form"}
      </output>
    </Button>
  );
}
