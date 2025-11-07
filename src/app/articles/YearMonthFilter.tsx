"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Group = {
   id: string;        // "2025-10"
   label: string;     // "2025 - Outubro"
   key: { year: number; month: number }; // month 0..11
};

function classNames(...xs: (string | false | null | undefined)[]) {
   return xs.filter(Boolean).join(" ");
}

export default function YearMonthFilter({ groups }: { groups: Group[] }) {
   const router = useRouter();
   const sp = useSearchParams();

   // Prepara estrutura: anos -> meses
   const { years, monthsByYear, defaultYear } = useMemo(() => {
      const yearsSet = new Set<number>();
      const map = new Map<number, Group[]>();

      for (const g of groups) {
         yearsSet.add(g.key.year);
         const arr = map.get(g.key.year) ?? [];
         arr.push(g);
         map.set(g.key.year, arr);
      }

      const sortedYears = Array.from(yearsSet).sort((a, b) => b - a); // anos desc
      for (const y of sortedYears) {
         map.set(
            y,
            (map.get(y) ?? []).sort((a, b) =>
               a.key.month === b.key.month ? 0 : a.key.month - b.key.month // meses asc (jan..dez)
            )
         );
      }

      return {
         years: sortedYears,
         monthsByYear: map,
         defaultYear: sortedYears[0],
      };
   }, [groups]);

   // Lê URL inicial (?year=YYYY&month=MM)
   const urlYear = sp.get("year");
   const urlMonth = sp.get("month");

   const initialYear =
      urlYear && /^\d{4}$/.test(urlYear) ? parseInt(urlYear, 10) : undefined;

   const [year, setYear] = useState<number>(initialYear ?? defaultYear);

   // Mantém ?year=YYYY em sincronia ao trocar ano
   useEffect(() => {
      const current = sp.get("year");
      const next = String(year);
      if (current !== next) {
         const params = new URLSearchParams(sp.toString());
         params.set("year", next);
         // Se ano troca, remove ?month para evitar highlight inconsistente
         params.delete("month");
         router.replace(`?${params.toString()}`, { scroll: false });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [year]);

   const months = monthsByYear.get(year) ?? [];

   // Smooth scroll até o h2#YYYY-MM
   const goToGroup = useCallback(
      (g: Group) => {
         const [yStr, mStr] = g.id.split("-");
         const params = new URLSearchParams(sp.toString());
         params.set("year", yStr);
         params.set("month", mStr.padStart(2, "0"));

         // Atualiza URL SEM recarregar
         router.replace(`?${params.toString()}#${g.id}`, { scroll: false });

         // Tenta rolar suavemente até o alvo
         const el = document.getElementById(g.id);
         if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
         } else {
            // fallback para anchor do browser
            window.location.hash = g.id;
         }
      },
      [router, sp]
   );

   // Se abrir já com ?year & ?month válidos, rola
   useEffect(() => {
      const m = urlMonth && /^\d{1,2}$/.test(urlMonth) ? parseInt(urlMonth, 10) : undefined;
      if (!m) return;
      // month 1..12 na URL, precisamos mapear para id "YYYY-MM"
      const id = `${year}-${String(m).padStart(2, "0")}`;
      const el = document.getElementById(id);
      if (el) {
         // usa setTimeout para esperar layout dos artigos
         const t = setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
         }, 50);
         return () => clearTimeout(t);
      }
   }, [year, urlMonth]);

   return (
      <div className="space-y-3">
         {/* Passo 1: escolher ano */}
         <div className="flex flex-wrap gap-2" role="tablist" aria-label="Anos">
            {years.map((y) => (
               <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={classNames(
                     "rounded-full border px-3 py-1 text-sm transition focus:outline-none focus:ring-2 focus:ring-neutral-500",
                     year === y
                        ? "border-neutral-900 text-neutral-900 bg-neutral-100"
                        : "border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-800"
                  )}
                  aria-pressed={year === y}
                  role="tab"
                  aria-selected={year === y}
                  aria-controls={`months-${y}`}
               >
                  {y}
               </button>
            ))}
         </div>

         {/* Passo 2: meses (aparecem só do ano selecionado) */}
         {months.length > 0 && (
            <nav
               id={`months-${year}`}
               className="text-sm text-neutral-700"
               aria-label={`Meses de ${year}`}
            >
               <span className="mr-2">Meses:</span>
               <ul className="inline-flex flex-wrap gap-x-3 gap-y-2">
                  {months.map((g) => (
                     <li key={g.id}>
                        <button
                           type="button"
                           onClick={() => goToGroup(g)}
                           className="rounded-full border px-3 py-1 transition hover:underline focus:outline-none focus:ring-2 focus:ring-neutral-500 border-neutral-300 text-neutral-700 hover:border-neutral-400"
                        >
                           {g.label.replace(`${year} - `, "")}
                        </button>
                     </li>
                  ))}
               </ul>
            </nav>
         )}
      </div>
   );
}
