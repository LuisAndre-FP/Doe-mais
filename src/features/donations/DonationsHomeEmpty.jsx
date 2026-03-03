import { Plus } from "lucide-react";
import { useSession } from "../../hooks/useSession";

export default function DonationsHomeEmpty({ onNewDonation }) {
  const { session } = useSession();

  const name =
    session?.user?.user_metadata?.name ||
    session?.user?.email?.split("@")?.[0] ||
    "Doador";

  return (
    <div className="w-full">
      {/* Título */}
      <div className="text-center pt-10 pb-8">
        <h2 className="text-4xl font-black text-slate-900">
          Olá, {name}! <span className="align-middle">👋</span>
        </h2>
        <p className="mt-2 text-slate-500 font-medium">
          Sua generosidade faz a diferença. Que tal mais uma doação?
        </p>
      </div>

      {/* Card central (a “Nova Doação” da 2ª imagem) */}
      <div className="flex items-center justify-center pb-10">
        <button
          type="button"
          onClick={onNewDonation}
          className="
            w-full max-w-md
            bg-white
            rounded-[2.5rem]
            border-2 border-dashed border-slate-200
            hover:border-emerald-300
            shadow-sm hover:shadow-md
            transition
            p-10
            text-center
            group
          "
        >
          {/* Ícone quadrado */}
          <div
            className="
              mx-auto
              h-24 w-24
              rounded-[2rem]
              bg-emerald-50
              flex items-center justify-center
              mb-6
              transition-transform
              group-hover:rotate-6
            "
          >
            <Plus className="h-12 w-12 text-emerald-600" strokeWidth={2.5} />
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-2">
            Nova Doação
          </h3>

          <p className="text-slate-500 font-medium">
            Descreva o item e nós cuidamos da coleta.
          </p>
        </button>
      </div>
    </div>
  );
}
