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
      <div className="text-center pt-4 pb-5">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 break-words">
          Olá, {name}! <span className="align-middle">👋</span>
        </h2>
        <p className="mt-1 text-slate-500 font-medium">
          Sua generosidade faz a diferença. Que tal mais uma doação?
        </p>
      </div>

      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={onNewDonation}
          className="
            w-full max-w-md
            bg-white
            rounded-[2rem]
            border-2 border-dashed border-slate-200
            hover:border-emerald-300
            shadow-sm hover:shadow-md
            transition
            p-8
            text-center
            group
          "
        >
          <div
            className="
              mx-auto
              h-20 w-20
              rounded-[1.5rem]
              bg-emerald-50
              flex items-center justify-center
              mb-5
              transition-transform
              group-hover:rotate-6
            "
          >
            <Plus className="h-10 w-10 text-emerald-600" strokeWidth={2.5} />
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-1.5">
            Nova Doação
          </h3>

          <p className="text-slate-500 font-medium text-sm">
            Descreva o item e nós cuidamos da coleta.
          </p>
        </button>
      </div>
    </div>
  );
}
