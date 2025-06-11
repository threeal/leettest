import { readdir } from "node:fs/promises";
import path from "node:path";
import { testCppSolution } from "./internal/solution.js";

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
    } else if (file.isFile() && file.name === "test.cpp") {
      results.push({
        dir,
        prom: new Promise((resolve) => {
          testCppSolution(dir).then(resolve).catch(resolve);
        }),
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
