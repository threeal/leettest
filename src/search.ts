import { globSync } from "glob";

/**
 * Searches for solution files based on the given file patterns.
 *
 * @param patterns - The patterns used to search for solution files.
 * @returns An array containing the paths of the solution files.
 */
export function searchSolutions(patterns: string[]): string[] {
  return patterns
    .map((pattern) => globSync(pattern))
    .flat()
    .sort();
}
