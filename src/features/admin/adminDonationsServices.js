import { supabase } from "../../lib/supabaseClient";

export async function listAllDonations(status = "ALL") {
  let q = supabase
    .from("donations")
    .select(`
      id, user_id, descricao, quantidade, estado_item, foto_path,
      status, coleta_data, coleta_periodo, coleta_observacao,
      created_at, updated_at,
      profiles:profiles ( id, nome, email, telefone, endereco )
    `)
    .order("created_at", { ascending: false });

  if (status && status !== "ALL") {
    q = q.eq("status", status);
  }

  return q;
}

export async function scheduleDonation(
  donationId,
  { coleta_data, coleta_periodo, coleta_observacao }
) {
  return supabase
    .from("donations")
    .update({
      status: "AGENDADA",
      coleta_data,
      coleta_periodo,
      coleta_observacao: coleta_observacao ?? null,
    })
    .eq("id", donationId);
}

export async function markAsCollected(donationId) {
  return supabase
    .from("donations")
    .update({ status: "COLETADA" })
    .eq("id", donationId);
}