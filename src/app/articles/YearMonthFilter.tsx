"use client";

import { useEffect, useMemo, useState } from "react";

type GroupKey = { year: number; month: number }; // coerente com page.tsx
type GroupLite = { id: string; label: string; key: GroupKey };

type Props = {
   groups: GroupLite[];
};

/**
 * Componente de filtro por ano/mês com acessibilidade corrigida:
 * - role="tablist" no container
 * - role="tab" em cada item
 * - aria-selected em vez de aria-pressed
 * 
 * Não depende de useSearchParams; ativa com base no hash atual (#YYYY-MM).
 */
export default function YearMonthFilter({ groups }: Props) {
   const [activeId, setActiveId] = useState<string | null>(null);

   // indexa por ano -> meses
   const byYear = useMemo(() => {
      const map = new Map<number, GroupLite[]>();
      for (const g of groups) {
         const arr = map.get(g.key.year) ?? [];
         arr.push(g);
         map.set(g.key.year, arr);
      }
      // ordena anos desc e meses desc
      return Array.from(map.entries())
         .sort((a, b) => b[0] - a[0])
         .map(([year, arr]) => [
            year,
            arr.sort((a, b) => b.key.month - a.key.month),
         ]) as Array<[number, GroupLite[]]>;
   }, [groups]);

   // sincronia com hash atual
   useEffect(() => {
      const applyFromHash = () => {
         const hash = typeof window !== "undefined" ? window.location.hash : "";
         const id = hash?.startsWith("#") ? hash.slice(1) : null;
         setActiveId(id && groups.some(g => g.id === id) ? id : null);
      };
      applyFromHash();
      window.addEventListener("hashchange", applyFromHash);
      return () => window.removeEventListener("hashchange", applyFromHash);
   }, [groups]);

   const handleClick = (id: string) => {
      setActiveId(id);
      // atualiza hash e faz scroll suave para o h2 correspondente
      if (typeof window !== "undefined") {
         const el = document.getElementById(id);
         if (el) {
            history.replaceState(null, "", `#${id}`);
            el.scrollIntoView({ behavior: "smooth", block: "start" });
         } else {
            // fallback: só atualiza hash
            location.hash = `#${id}`;
         }
      }
   };

   if (groups.length === 0) return null;

   return (
      <nav aria-label="Navegação por ano e mês" className="rounded-lg border border-neutral-200 p-3">
         <div role="tablist" aria-label="Meses por ano" className="space-y-2">
            {byYear.map(([year, arr]) => (
               <div key={year} className="flex flex-wrap items-center gap-2">
                  <span className="mr-2 text-sm font-semibold text-neutral-800">{year}</span>
                  {arr.map(({ id, label }) => {
                     const isActive = activeId === id;
                     return (
                        <button
                           key={id}
                           role="tab"
                           aria-selected={isActive}
                           // aria-pressed REMOVIDO
                           onClick={() => handleClick(id)}
                           className={[
                              "rounded-md border px-2.5 py-1 text-sm transition",
                              isActive
                                 ? "border-neutral-900 bg-neutral-900 text-white"
                                 : "border-neutral-300 bg-white hover:border-neutral-900"
                           ].join(" ")}
                        >
                           {label.split(" - ")[1] ?? label}
                        </button>
                     );
                  })}
               </div>
            ))}
         </div>
      </nav>
   );
}
