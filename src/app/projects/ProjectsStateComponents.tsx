import { ReactNode } from "react";

const SKELETON_ITEMS = 6;

/**
 * Skeleton loader for projects grid
 */
export function ProjectsLoadingSkeleton(): ReactNode {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: SKELETON_ITEMS }).map((_, i) => (
                <div
                    key={`skeleton-${i}`}
                    className="rounded-lg border border-neutral-200 p-5"
                >
                    <div className="h-5 w-2/3 bg-neutral-200 rounded mb-3 animate-pulse" />
                    <div className="h-4 w-full bg-neutral-100 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-5/6 bg-neutral-100 rounded mb-6 animate-pulse" />
                    <div className="h-8 w-32 bg-neutral-200 rounded animate-pulse" />
                </div>
            ))}
        </div>
    );
}

/**
 * Error state for when projects fail to load
 */
export function ProjectsErrorState(): ReactNode {
    return (
        <p className="text-center text-red-600 py-8">
            Erro ao carregar projetos do GitHub.
        </p>
    );
}

/**
 * Empty state for when no projects match the search
 */
export function ProjectsEmptyState({ query }: { query: string }): ReactNode {
    return (
        <p className="text-center text-neutral-500 py-8">
            Nenhum projeto encontrado para "{query}".
        </p>
    );
}
