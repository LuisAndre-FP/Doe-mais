import { supabase } from "../../lib/supabaseClient";

// helpers
function getFileExt(file) {
  const name = file?.name ?? "";
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
}

/**
 * 1) cria a doação (sem foto)
 * 2) se tiver foto, faz upload no storage usando: <uid>/<donationId>/photo.<ext>
 * 3) salva foto_path na tabela
 */
export async function createDonation({ descricao, quantidade, estado_item, fotoFile }) {
  // pega o usuário logado
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) return { data: null, error: authErr };

  const user = authData?.user;
  if (!user) return { data: null, error: new Error("Usuário não autenticado") };

  // 1) cria doação
  const { data: donation, error: insertErr } = await supabase
    .from("donations")
    .insert({
      user_id: user.id,
      descricao,
      quantidade,
      estado_item: estado_item ?? null,
      // status vai como default PENDENTE
    })
    .select("*")
    .single();

  if (insertErr) return { data: null, error: insertErr };

  // 2) upload opcional da foto
  if (fotoFile) {
    const ext = getFileExt(fotoFile);
    const filePath = `${user.id}/${donation.id}/photo.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("donation-photos")
      .upload(filePath, fotoFile, {
        upsert: true,
        contentType: fotoFile.type || undefined,
      });

    if (uploadErr) {
      // se falhar upload, você pode: manter doação sem foto OU apagar doação.
      // Vou manter e retornar erro pra você tratar no UI.
      return { data: donation, error: uploadErr };
    }

    // 3) salva o caminho da foto na doação
    const { data: updated, error: updateErr } = await supabase
      .from("donations")
      .update({ foto_path: filePath })
      .eq("id", donation.id)
      .select("*")
      .single();

    if (updateErr) return { data: donation, error: updateErr };

    return { data: updated, error: null };
  }

  return { data: donation, error: null };
}

export async function listMyDonations() {
  return supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false });
}

/**
 * Para bucket privado: cria uma URL assinada (expira)
 * Você usa isso pra mostrar a imagem no <img src="...">
 */
export async function getDonationPhotoSignedUrl(fotoPath, expiresInSeconds = 60 * 10) {
  if (!fotoPath) return { data: null, error: null };

  return supabase.storage
    .from("donation-photos")
    .createSignedUrl(fotoPath, expiresInSeconds);
}
