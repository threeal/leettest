import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { generateCppMainCode } from "./main.js";
import { generateCppUtilityCode } from "./utility.js";
import { CppTestCaseSchema, generateCppTestCaseCode } from "./test_case.js";

/**
 * Generates a C++ test file from a test schema.
 *
 * @param schema - The test schema.
 * @param solutionFile - The path of the C++ solution file.
 * @param outFile - The path of the C++ test file output.
 */
export function generateCppTest(
  schema: unknown,
  solutionFile: string,
  outFile: string,
): void {
  const cppTestSchema = schema as CppTestCaseSchema;

  const main = generateCppMainCode(cppTestSchema);

  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(
    outFile,
    [
      `#include "${path.relative(path.dirname(outFile), solutionFile)}"`,
      ``,
      [...main.headers]
        .sort()
        .map((header) => `#include <${header}>`)
        .join("\n"),
      ``,
      generateCppTestCaseCode(cppTestSchema),
      generateCppUtilityCode(cppTestSchema),
      main.code,
    ].join("\n"),
  );
}
