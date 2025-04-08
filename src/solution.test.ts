import { rm } from "node:fs/promises";
import path from "node:path";
import { afterAll, expect, test } from "vitest";
import { testSolutions } from "./solution.js";
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
  const solutionFiles = await testSolutions(tempDir);
  expect(solutionFiles).toEqual([
    path.join(tempDir, "bar", "solution.cpp"),
    path.join(tempDir, "foo", "bar", "solution.cpp"),
    path.join(tempDir, "foo", "solution.cpp"),
  ]);
});

afterAll(() => rm(tempDir, { recursive: true }));
