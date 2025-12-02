"use client";

import { useEffect, useMemo, useState } from "react";

type GroupKey = { year: number; month: number };
type GroupLite = { id: string; label: string; key: GroupKey };

type Props = {
   groups: GroupLite[];
};

export default function YearMonthFilter({ groups }: Props) {
   const byYear = useMemo(() => {
      const map = new Map<number, GroupLite[]>();
      for (const g of groups) {
         const arr = map.get(g.key.year) ?? [];
         arr.push(g);
         map.set(g.key.year, arr);
      }
      for (const [year, arr] of map) {
         arr.sort((a, b) => b.key.month - a.key.month);
         map.set(year, arr);
      }
      return map;
   }, [groups]);

   const yearsDesc = useMemo(
      () => Array.from(byYear.keys()).sort((a, b) => b - a),
      [byYear]
   );

   const [activeId, setActiveId] = useState<string | null>(null);
   const [selectedYear, setSelectedYear] = useState<number | null>(null);

   useEffect(() => {
      const init = () => {
         const hash = typeof window !== "undefined" ? window.location.hash : "";
         const id = hash?.startsWith("#") ? hash.slice(1) : null;
         const group = id ? groups.find((g) => g.id === id) : null;
         const initialYear = group?.key.year ?? (yearsDesc[0] ?? null);
         setActiveId(id && group ? id : null);
         setSelectedYear(initialYear);
      };
      init();

      const onHash = () => {
         const hash = window.location.hash;
         const id = hash?.startsWith("#") ? hash.slice(1) : null;
         const group = id ? groups.find((g) => g.id === id) : null;
         if (group) {
            setSelectedYear(group.key.year);
            setActiveId(id);
         } else {
            setActiveId(null);
         }
      };

      window.addEventListener("hashchange", onHash);
      return () => window.removeEventListener("hashchange", onHash);
   }, [groups, yearsDesc]);

   const months = selectedYear != null ? byYear.get(selectedYear) ?? [] : [];

   const handleClickMonth = (id: string) => {
      setActiveId(id);
      if (typeof window !== "undefined") {
         const el = document.getElementById(id);
         history.replaceState(null, "", `#${id}`);
         el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
   };

   return (
      <nav
         aria-label="Filtro de ano e meses"
         className="rounded-lg border border-neutral-200 p-4 space-y-3 bg-white"
      >
         <div className="flex flex-wrap items-center gap-2">
            <label
               htmlFor="year-select"
               className="text-sm font-medium text-neutral-800"
            >
               Selecionar ano:
            </label>
            <select
               id="year-select"
               className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-neutral-800"
               value={selectedYear ?? ""}
               onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
               {yearsDesc.map((y) => (
                  <option key={y} value={y}>
                     {y}
                  </option>
               ))}
            </select>
         </div>

         {months.length > 0 && (
            <div
               aria-label={`Meses de ${selectedYear}`}
               className="flex flex-wrap gap-2"
            >
               {months.map(({ id, label }) => {
                  const isActive = activeId === id;
                  const month = label.split(" - ")[1] ?? label;
                  return (
                     <button
                        key={id}
                        type="button"
                        onClick={() => handleClickMonth(id)}
                        className={[
                           "rounded-md border px-2.5 py-1 text-sm transition",
                           isActive
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-300 bg-white hover:border-neutral-900",
                        ].join(" ")}
                        aria-current={isActive ? "true" : undefined}
                     >
                        {month}
                     </button>
                  );
               })}
            </div>
         )}
      </nav>
   );
}