import { ReactNode } from "react";
import { getPaginationItems, type SortOption } from "@/lib/projects-utils";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    neighbors: number;
}

interface SortFilterProps {
    sort: SortOption;
    onSortChange: (sort: SortOption) => void;
    query: string;
    onQueryChange: (query: string) => void;
}

/**
 * Pagination navigation component
 */
export function Pagination({
    totalPages,
    currentPage,
    onPageChange,
    neighbors,
}: PaginationProps): ReactNode {
    const pageItems = getPaginationItems(totalPages, currentPage, neighbors, 1);

    return (
        <nav className="pt-6">
            <ul className="flex flex-wrap items-center justify-center gap-2">
                {/* Previous Button */}
                <li>
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border text-sm disabled:opacity-50 hover:bg-neutral-50 transition-colors"
                        aria-label="Página anterior"
                    >
                        Anterior
                    </button>
                </li>

                {/* Page Items */}
                {pageItems.map((item, idx) =>
                    item === "..." ? (
                        <li key={`ellipsis-${idx}`} className="px-2 text-neutral-500 select-none">
                            …
                        </li>
                    ) : (
                        <li key={`page-${item}`}>
                            <button
                                onClick={() => onPageChange(item)}
                                aria-current={item === currentPage ? "page" : undefined}
                                className={`px-2.5 py-1 text-sm border border-neutral-300 rounded transition-colors ${item === currentPage
                                        ? "bg-neutral-100 font-semibold"
                                        : "hover:bg-neutral-50"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                            >
                                {item}
                            </button>
                        </li>
                    )
                )}

                {/* Next Button */}
                <li>
                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border text-sm disabled:opacity-50 hover:bg-neutral-50 transition-colors"
                        aria-label="Próxima página"
                    >
                        Próxima
                    </button>
                </li>
            </ul>
        </nav>
    );
}

/**
 * Search and sort controls component
 */
export function SortFilter({
    sort,
    onSortChange,
    query,
    onQueryChange,
}: SortFilterProps): ReactNode {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onQueryChange(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as SortOption;
        onSortChange(value);
    };

    return (
        <section className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 flex-1">
                <input
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Buscar por nome ou descrição…"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-ring"
                    aria-label="Buscar repositórios"
                />
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-sm text-neutral-600 whitespace-nowrap">
                    Ordenar:
                </label>
                <select
                    id="sort-select"
                    value={sort}
                    onChange={handleSortChange}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-ring"
                >
                    <option value="recent">Recentes</option>
                    <option value="stars">Mais estrelados</option>
                    <option value="az">A → Z</option>
                </select>
            </div>
        </section>
    );
}
