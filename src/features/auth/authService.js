import { supabase } from "../../lib/supabaseClient";

export async function loginWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export async function loginWithEmail(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function registerWithEmail(email, password) {
  return supabase.auth.signUp({ email, password });
}

export async function requestPasswordReset(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/atualizar-senha`,
  });
}

export async function logout() {
  return supabase.auth.signOut();
}
