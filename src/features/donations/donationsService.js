import { supabase } from "../../lib/supabaseClient";

function getFileExt(file) {
  const name = file?.name ?? "";
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
}

export async function createDonation({
  descricao,
  quantidade,
  estado_item,
  fotoFile,
}) {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) return { data: null, error: authErr };

  const user = authData?.user;
  if (!user) return { data: null, error: new Error("Usuário não autenticado") };

  const { data: donation, error: insertErr } = await supabase
    .from("donations")
    .insert({
      user_id: user.id,
      descricao,
      quantidade,
      estado_item: estado_item ?? null,
    })
    .select("*")
    .single();

  if (insertErr) return { data: null, error: insertErr };

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
      return { data: donation, error: uploadErr };
    }

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

export async function getDonationPhotoSignedUrl(
  fotoPath,
  expiresInSeconds = 60 * 60 * 2,
) {
  if (!fotoPath) return { data: null, error: null };

  return supabase.storage
    .from("donation-photos")
    .createSignedUrl(fotoPath, expiresInSeconds);
}
