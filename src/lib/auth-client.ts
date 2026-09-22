import { createAuthClient } from "better-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export const authClient = createAuthClient({
  baseURL: API_URL,
});

export function startGoogleSignIn() {
  return authClient.signIn.social({
    provider: "google",
    callbackURL: `${window.location.origin}/login/oauth`,
  });
}
