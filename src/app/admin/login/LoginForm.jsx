"use client";

import { useActionState } from "react";
import { signInWithPassword } from "@/lib/auth/actions";
import styles from "./login.module.css";

const initialState = { error: null };

export default function LoginForm({ nextPath }) {
  const [state, formAction, isPending] = useActionState(
    signInWithPassword,
    initialState
  );

  return (
    <form className={styles.form} action={formAction}>
      <input type="hidden" name="next" value={nextPath} />

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          className={styles.input}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          className={styles.input}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error ? <p className={styles.error}>{state.error}</p> : null}

      <button className={styles.button} type="submit" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
