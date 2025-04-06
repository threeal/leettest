import fsPromises from "node:fs/promises";
import path from "node:path";

export async function testSolutions(dir: string): Promise<string[]> {
  const files: string[] = [];
  const pattern = path.join(dir, "**", "solution.cpp");
  for await (const file of fsPromises.glob(pattern)) {
    files.push(file);
  }

  // TODO: It currently only returns the list of solution files.
  return files;
}
