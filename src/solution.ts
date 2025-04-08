import { readdir } from "node:fs/promises";
import path from "node:path";

export async function testSolutions(dir: string): Promise<string[]> {
  const childSolutions: Promise<string[]>[] = [];
  const solutions: string[] = [];

  for (const file of await readdir(dir, { withFileTypes: true })) {
    if (file.isDirectory()) {
      childSolutions.push(testSolutions(path.join(dir, file.name)));
    } else if (file.isFile() && file.name === "solution.cpp") {
      solutions.push(path.join(dir, file.name));
    }
  }

  // TODO: It currently only returns the list of solution files.
  return [...(await Promise.all(childSolutions)).flat(), ...solutions];
}
