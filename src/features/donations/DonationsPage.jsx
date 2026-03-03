import { useEffect, useState } from "react";
import DonationForm from "../donations/DonationsForm";
import { listMyDonations } from "./donationsService";
import DonationsHomeEmpty from "./DonationsHomeEmpty";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import ProfileIncompleteModal from "../../components/ProfileIncompleteModal";

import { useSession } from "../../hooks/useSession";
import { getProfile } from "../profile/profileService";

export default function DonationsPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const navigate = useNavigate();

  const { session, loading: sessionLoading } = useSession();
  const user = session?.user ?? null;

  const reload = async () => {
    setErrorMsg("");
    setLoading(true);

    const { error } = await listMyDonations();

    setLoading(false);
    if (error) setErrorMsg(error.message || "Erro ao carregar.");
  };

  // carrega doações
  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // checa perfil (primeira vez)
  useEffect(() => {
    const run = async () => {
      if (sessionLoading) return;
      if (!user) return;

      const { data, error } = await getProfile(user.id);
      if (error) return;

      if (!data?.profile_completed) {
        setProfileModalOpen(true);
      }
    };

    run();
  }, [sessionLoading, user]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <ProfileIncompleteModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {errorMsg ? (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="rounded-2xl bg-red-50 text-red-700 border border-red-200 px-4 py-3">
            {errorMsg}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="rounded-2xl bg-white border p-6">Carregando...</div>
        </div>
      ) : (
        <DonationsHomeEmpty onNewDonation={() => setModalOpen(true)} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <DonationForm
          onCancel={() => setModalOpen(false)}
          onSuccess={(createdDonation) => {
            setModalOpen(false);
            navigate("/minhas-doacoes", {
              replace: true,
              state: { highlightId: createdDonation?.id },
            });
          }}
        />
      </Modal>
    </div>
  );
}
