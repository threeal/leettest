import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, expect, it } from "vitest";
import { testSolutions } from "./index.js";

const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "temp"));

it("should test solutions", async () => {
  const solutionDir = path.join(tempDir, "multiply_integers");
  await fs.mkdir(solutionDir);

  await fs.writeFile(
    path.join(solutionDir, "solution.cpp"),
    [
      `class Solution {`,
      ` public:`,
      `  int multiplyIntegers(int num1, int num2) {`,
      `    return num1 * num2;`,
      `  }`,
      `};`,
      ``,
    ].join("\n"),
  );

  const solutionFiles = await testSolutions(tempDir);
  expect(solutionFiles).toEqual([path.join(solutionDir, "solution.cpp")]);
});

afterAll(() => fs.rmdir(tempDir, { recursive: true }));
