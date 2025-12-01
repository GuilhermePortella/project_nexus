/**
 * Utility functions for projects page
 */

const EMOJI_MAP: Record<string, string> = {
    ":camera:": "📷",
    ":rocket:": "🚀",
    ":star:": "⭐",
    ":fire:": "🔥",
    ":zap:": "⚡",
    ":computer:": "💻",
    ":bug:": "🐛",
    ":tada:": "🎉",
    ":art:": "🎨",
    ":memo:": "📝",
    ":lock:": "🔒",
    ":mag:": "🔍",
    ":books:": "📚",
    ":book:": "📚",
    ":pencil:": "✏️",
    ":eyes:": "👀",
};

/**
 * Replaces emoji shortcodes with actual emoji characters
 * @param text - Text potentially containing emoji shortcodes
 * @returns Text with emojis converted
 */
export function parseEmojis(text: string | null): string {
    if (!text) return "";

    return text.replace(/:[\w?]+:/g, (match) => EMOJI_MAP[match] || match);
}

/**
 * Clamps a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, value));

/**
 * Creates an array of numbers from start to end (inclusive)
 */
export const range = (start: number, end: number): number[] =>
    Array.from(
        { length: Math.max(0, end - start + 1) },
        (_, i) => start + i
    );

/**
 * Generates pagination items with ellipsis for large page counts
 * @param total - Total number of pages
 * @param current - Current page number
 * @param neighbors - Number of pages to show around current page
 * @param edgeCount - Number of pages to show at start and end
 * @returns Array of page numbers and ellipsis strings
 */
export function getPaginationItems(
    total: number,
    current: number,
    neighbors: number,
    edgeCount = 1
): (number | "...")[] {
    const page = clamp(current, 1, Math.max(1, total));

    if (total <= 1) return [1];

    const start = range(1, Math.min(edgeCount, total));
    const end = range(
        Math.max(total - edgeCount + 1, edgeCount + 1),
        total
    );

    const middleStart = clamp(page - neighbors, edgeCount + 1, total - edgeCount);
    const middleEnd = clamp(page + neighbors, edgeCount, total - edgeCount);

    const items: (number | "...")[] = [];
    items.push(...start);

    if (middleStart > start[start.length - 1] + 1) items.push("...");
    if (middleEnd >= middleStart) items.push(...range(middleStart, middleEnd));
    if (end.length && end[0] > (items[items.length - 1] as number) + 1)
        items.push("...");

    items.push(...end);

    // Remove consecutive duplicates
    const dedup: (number | "...")[] = [];
    for (const item of items) {
        const last = dedup[dedup.length - 1];
        if (last === "..." && item === "...") continue;
        if (typeof last === "number" && typeof item === "number" && last === item)
            continue;
        dedup.push(item);
    }

    return dedup;
}

export const SORT_OPTIONS = ["recent", "stars", "az"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

/**
 * Type guard to check if a string is a valid sort option
 */
export function isSortOption(value: string): value is SortOption {
    return (SORT_OPTIONS as readonly string[]).includes(value);
}
