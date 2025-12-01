"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import ProjectCard from "./ProjectCard";
import {
  parseEmojis,
  isSortOption,
  type SortOption,
} from "@/lib/projects-utils";
import { useNeighborWindow } from "./useNeighborWindow";
import {
  ProjectsLoadingSkeleton,
  ProjectsErrorState,
  ProjectsEmptyState,
} from "./ProjectsStateComponents";
import { Pagination, SortFilter } from "./ProjectsControls";

/**
 * GitHub repository type definition
 */
type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count?: number;
  language?: string | null;
  homepage?: string | null;
};

/**
 * Configuration constants
 */
const PROJECTS_PER_PAGE = 6;
const GITHUB_API_URL =
  "https://api.github.com/users/guilhermeportella/repos?sort=pushed&per_page=100";
const DEFAULT_SORT: SortOption = "recent";

/**
 * Projects page component
 * Fetches and displays GitHub repositories with search, filtering, and pagination
 *
 * Features:
 * - Fetches repositories from GitHub API
 * - Search functionality by name and description
 * - Multiple sort options (recent, stars, alphabetical)
 * - Responsive pagination
 * - Loading, error, and empty states
 */
export default function ProjectsPage() {
  // State management
  const [repos, setRepos] = useState<Repo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT);

  // Hooks
  const neighbors = useNeighborWindow();

  /**
   * Fetch repositories from GitHub API on component mount
   */
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const response = await fetch(GITHUB_API_URL);

        if (!response.ok) {
          throw new Error(
            `GitHub API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setRepos(Array.isArray(data) ? data : []);
        setError(false);
      } catch (err) {
        console.error("Failed to fetch repositories:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  /**
   * Filter and sort repositories based on query and sort option
   */
  const filtered = useMemo(() => {
    const searchQuery = query.trim().toLowerCase();
    let filtered = repos.filter((repo) => {
      if (!searchQuery) return true;
      const searchText = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
      return searchText.includes(searchQuery);
    });

    // Apply sorting
    switch (sort) {
      case "stars":
        filtered.sort(
          (a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0)
        );
        break;
      case "az":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recent":
      default:
        // Keep original order (recently pushed)
        break;
    }

    return filtered;
  }, [repos, query, sort]);

  /**
   * Calculate total pages for pagination
   */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PROJECTS_PER_PAGE));

  /**
   * Reset to last page if current page exceeds total pages
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  /**
   * Handle search query change - reset to first page
   */
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  /**
   * Handle sort option change
   */
  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
  };

  // Calculate pagination slice
  const start = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedRepos = filtered.slice(start, start + PROJECTS_PER_PAGE);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-10">
      {/* Header Section */}
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold">Projetos no GitHub 🚀</h1>
        <p className="text-neutral-600">
          Repositórios públicos atualizados com frequência. Filtre, ordene e explore.
        </p>
      </header>

      {/* Search and Sort Controls */}
      <SortFilter
        query={query}
        onQueryChange={handleQueryChange}
        sort={sort}
        onSortChange={handleSortChange}
      />

      {/* Content States */}
      {loading ? (
        <ProjectsLoadingSkeleton />
      ) : error ? (
        <ProjectsErrorState />
      ) : filtered.length === 0 ? (
        <ProjectsEmptyState query={query} />
      ) : (
        <>
          {/* Projects Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRepos.map((repo) => (
              <ProjectCard
                key={repo.id}
                name={repo.name}
                description={
                  repo.description
                    ? parseEmojis(repo.description)
                    : "Sem descrição."
                }
                stars={repo.stargazers_count ?? 0}
                language={repo.language ?? null}
                githubUrl={repo.html_url}
                homepage={repo.homepage ?? null}
              />
            ))}
          </div>

          {/* Pagination - Only show if more than 1 page */}
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              neighbors={neighbors}
            />
          )}
        </>
      )}

      {/* Footer */}
      <Footer />
    </main>
  );
}
