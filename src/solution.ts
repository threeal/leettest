import { readdir } from "node:fs/promises";
import path from "node:path";

export interface TestResult {
  dir: string;
  err: unknown;
}

export async function* testSolutions(dir: string): AsyncIterable<TestResult> {
  const childResults: AsyncIterable<TestResult>[] = [];
  const results: { dir: string; prom: Promise<unknown> }[] = [];

  for (const file of await readdir(dir, { withFileTypes: true })) {
    if (file.isDirectory()) {
      childResults.push(testSolutions(path.join(dir, file.name)));
    } else if (file.isFile() && file.name === "solution.cpp") {
      results.push({
        dir: path.join(dir, file.name),
        prom: Promise.resolve(null), // TODO: modify to test the solution.
      });
    }
  }

  for (const { dir, prom } of results) {
    yield { dir, err: await prom };
  }

  for (const results of childResults) {
    for await (const result of results) {
      yield result;
    }
  }
}
