"use client";

import { useActionState } from "react";

import { login, type LoginState } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const INITIAL_STATE: LoginState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, INITIAL_STATE);
  const errorId = state.error ? "login-error" : undefined;
  return (
    <form
      action={formAction}
      className="space-y-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
    >
      <div className="space-y-1.5">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          defaultValue={state.username}
          required
          aria-invalid={Boolean(state.error)}
          aria-describedby={errorId}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state.error)}
          aria-describedby={errorId}
        />
      </div>

      {state.error && (
        <p
          id="login-error"
          role="alert"
          className="text-sm text-red-600 dark:text-red-400"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-xs text-zinc-500">
        FakeStoreAPI test account: <code className="font-mono">mor_2314</code> /{" "}
        <code className="font-mono">83r5^_</code>
      </p>
    </form>
  );
}
