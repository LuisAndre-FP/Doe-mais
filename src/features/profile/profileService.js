import { supabase } from "../../lib/supabaseClient";

export async function getProfile(userId) {
  return supabase
    .from("profiles")
    .select("nome,email,telefone,endereco,profile_completed, role")
    .eq("id", userId)
    .single();
}

export async function updateProfile(
  userId,
  { nome, telefone, endereco, profile_completed },
) {
  return supabase
    .from("profiles")
    .update({ nome, telefone, endereco, profile_completed })
    .eq("id", userId);
}
