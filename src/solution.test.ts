import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { afterAll, expect, test, vi } from "vitest";
import { testCppSolution } from "./internal/solution.js";
import { createTempFs } from "./internal/temp-fs.js";
import { type TestResult, testSolutions } from "./solution.js";

vi.mock("./internal/solution.js", () => ({
  testCppSolution: vi.fn(),
}));

vi.mocked(testCppSolution).mockImplementation(async (dir) => {
  const content = await readFile(path.join(dir, "test.cpp"), "utf-8");
  if (content !== "valid\n") throw new Error();
});

const tempDir = await createTempFs({
  foo: {
    bar: {
      "test.cpp": "valid",
    },
    baz: {
      "test.js": "valid",
    },
    "test.cpp": "invalid",
  },
  bar: {
    "test.cpp": "valid",
  },
  baz: {},
});

test("test solutions", async () => {
  const results: TestResult[] = [];
  for await (const result of testSolutions(tempDir)) {
    results.push(result);
  }

  expect(results).toEqual([
    { dir: path.join(tempDir, "bar"), err: undefined },
    { dir: path.join(tempDir, "foo"), err: new Error() },
    { dir: path.join(tempDir, "foo", "bar"), err: undefined },
  ]);
});

afterAll(() => rm(tempDir, { recursive: true }));
