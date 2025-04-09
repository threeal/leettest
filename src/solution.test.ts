import { rm } from "node:fs/promises";
import path from "node:path";
import { afterAll, expect, test } from "vitest";
import { type TestResult, testSolutions } from "./solution.js";
import { createTempFs } from "./internal/temp-fs.js";

const tempDir = await createTempFs({
  foo: {
    bar: {
      "solution.cpp": "",
    },
    baz: {
      "solution.js": "",
    },
    "solution.cpp": "",
  },
  bar: {
    "solution.cpp": "",
  },
  baz: {},
});

test("test solutions", async () => {
  const results: TestResult[] = [];
  for await (const result of testSolutions(tempDir)) {
    results.push(result);
  }

  expect(results).toEqual([
    { dir: path.join(tempDir, "bar", "solution.cpp"), err: null },
    { dir: path.join(tempDir, "foo", "solution.cpp"), err: null },
    { dir: path.join(tempDir, "foo", "bar", "solution.cpp"), err: null },
  ]);
});

afterAll(() => rm(tempDir, { recursive: true }));
