"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ArticleSearchDoc = {
  slug: string;
  title: string;
  summary?: string;
  publishedAt?: string;
  content: string;
};

type Props = {
  index: ArticleSearchDoc[];
};

export default function ArticlesSearch({ index }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
  }, [searchParams]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter((d) => {
        const hay = `${d.title} ${d.summary ?? ""} ${d.content}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 10);
  }, [index, query]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) params.set("q", query);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="space-y-3">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, resumo ou conteúdo…"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-800"
          aria-label="Buscar artigos"
        />
        <button
          type="submit"
          className="rounded-lg border border-neutral-900 px-4 py-2 font-medium hover:bg-neutral-900 hover:text-white transition"
        >
          Buscar
        </button>
      </form>

      {query && (
        <div className="rounded-lg border border-neutral-200 p-3">
          {results.length === 0 ? (
            <p className="text-sm text-neutral-600">
              Nenhum resultado para “{query}”.
            </p>
          ) : (
            <ul className="space-y-2">
              {results.map((r) => (
                <li key={r.slug}>
                  <a
                    href={`/articles/${r.slug}/`}
                    className="underline hover:no-underline"
                  >
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}