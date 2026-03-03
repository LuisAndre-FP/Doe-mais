import { supabase } from "../../lib/supabaseClient";

export async function listUsersProfiles({ q = "" } = {}) {
  let query = supabase
    .from("profiles")
    .select("id,nome,email,role,created_at")
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    const s = `%${q.trim()}%`;
    query = query.or(`nome.ilike.${s},email.ilike.${s}`);
  }

  return query;
}

export async function setUserRole(targetUserId, newRole) {
  return supabase.rpc("set_user_role", {
    target_user_id: targetUserId,
    new_role: newRole, // "USER" | "ADMIN"
  });
}

export async function listRoleAudit({ limit = 50 } = {}) {
  return supabase
    .from("role_audit")
    .select(
      `
      id, created_at, old_role, new_role,
      actor:actor_id ( id, nome, email ),
      target:target_id ( id, nome, email )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);
}