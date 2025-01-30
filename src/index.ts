import { globSync } from "glob";

export async function testSolutions(patterns: string[]): Promise<string[]> {
  // TODO: It currently only returns the list of solution files.
  return patterns
    .map((pattern) => globSync(pattern))
    .flat()
    .sort();
}
