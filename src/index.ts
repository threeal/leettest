import { glob } from "glob";
import path from "node:path";

export async function testSolutions(dir: string): Promise<string[]> {
  // TODO: It currently only returns the list of solution files.
  return glob(path.join(dir, "**", "solution.cpp"));
}
