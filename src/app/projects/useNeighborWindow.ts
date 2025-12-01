/**
 * Custom hook for responsive neighbor window sizing
 * Determines how many pagination items to show based on screen size
 */

import { useEffect, useState } from "react";

const BREAKPOINTS = {
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
} as const;

const NEIGHBOR_VALUES = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
} as const;

export function useNeighborWindow(): number {
    const [neighbors, setNeighbors] = useState<number>(NEIGHBOR_VALUES.mobile);

    useEffect(() => {
        const mdQuery = window.matchMedia(BREAKPOINTS.md);
        const lgQuery = window.matchMedia(BREAKPOINTS.lg);

        const updateNeighbors = () => {
            if (lgQuery.matches) {
                setNeighbors(NEIGHBOR_VALUES.desktop);
            } else if (mdQuery.matches) {
                setNeighbors(NEIGHBOR_VALUES.tablet);
            } else {
                setNeighbors(NEIGHBOR_VALUES.mobile);
            }
        };

        // Initial calculation
        updateNeighbors();

        // Add listeners
        mdQuery.addEventListener("change", updateNeighbors);
        lgQuery.addEventListener("change", updateNeighbors);

        // Cleanup
        return () => {
            mdQuery.removeEventListener("change", updateNeighbors);
            lgQuery.removeEventListener("change", updateNeighbors);
        };
    }, []);

    return neighbors;
}
