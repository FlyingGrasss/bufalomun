"use client";
import { useFormStatus } from "react-dom";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/field";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(buttonVariants(), "mt-5 w-full gap-2")}
      aria-busy={pending}
    >
      {pending && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

type Props = {
  action: ComponentProps<"form">["action"];
  error?: boolean;
};

export default function LoginForm({ action, error }: Props) {
  return (
    <form action={action} className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-white p-7">
      <p className="eyebrow text-[var(--red)]">Private area</p>
      <h1 className="mt-3 font-display text-5xl">Administration</h1>
      <label htmlFor="password" className="mt-8 block text-sm font-bold">
        Shared password
      </label>
      <Input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="mt-2"
      />
      {error && (
        <p className="mt-3 text-sm text-red-700">The password was not accepted. Please try again.</p>
      )}
      <SubmitButton />
    </form>
  );
}
