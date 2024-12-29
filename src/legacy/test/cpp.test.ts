import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { testCppSolution } from "./cpp.js";

describe("test a C++ solution file", () => {
  const testDirs: ITempDirectory[] = [];
  const getTestDir = async () => {
    const testDir = await createTempDirectory();
    testDirs.push(testDir);
    return testDir;
  };

  const writeSchemaFile = async (schemaDir: string) =>
    fs.writeFile(
      path.join(schemaDir, "test.yaml"),
      [
        `cpp:`,
        `  function:`,
        `    name: sum`,
        `    arguments: [num1, num2]`,
        `  inputs:`,
        `    num1: int`,
        `    num2: int`,
        `  output: int`,
        ``,
        `cases:`,
        `  - name: example 1`,
        `    inputs:`,
        `      num1: 12`,
        `      num2: 5`,
        `    output: 17`,
        ``,
        `  - name: example 2`,
        `    inputs:`,
        `      num1: -10`,
        `      num2: 4`,
        `    output: -6`,
        ``,
      ].join("\n"),
    );

  it.concurrent(
    "should test a correct C++ solution file",
    async () => {
      const testDir = await getTestDir();

      const solutionFile = path.join(testDir.path, "solution.cpp");
      await Promise.all([
        fs.writeFile(
          solutionFile,
          [
            `class Solution {`,
            ` public:`,
            `  int sum(int num1, int num2) {`,
            `    return num1 + num2;`,
            `  }`,
            `};`,
            ``,
          ].join("\n"),
        ),
        writeSchemaFile(testDir.path),
      ]);

      await testCppSolution(solutionFile);
    },
    60000,
  );

  it.concurrent(
    "should test a wrong C++ solution file",
    async () => {
      const testDir = await getTestDir();

      const solutionFile = path.join(testDir.path, "solution.cpp");
      await Promise.all([
        fs.writeFile(
          solutionFile,
          [
            `class Solution {`,
            ` public:`,
            `  int sum(int num1, int num2) {`,
            `    return num1 - num2;`,
            `  }`,
            `};`,
            ``,
          ].join("\n"),
        ),
        writeSchemaFile(testDir.path),
      ]);

      await expect(testCppSolution(solutionFile)).rejects.toThrow(
        /2 test cases have failed/,
      );
    },
    60000,
  );

  afterAll(async () => {
    await Promise.all(testDirs.map((testDir) => testDir.remove()));
  });
});
