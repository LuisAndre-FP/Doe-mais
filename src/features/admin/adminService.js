import { supabase } from "../../lib/supabaseClient";

export async function getMyRole() {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) return { data: null, error: authErr };

  const user = authData?.user;
  if (!user) return { data: null, error: new Error("Usuário não autenticado") };

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) return { data: null, error };

  // 🔥 garante string limpa
  return { data: String(data?.role ?? "").trim(), error: null };
}
