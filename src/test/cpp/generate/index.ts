import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Schema } from "../../schema.js";
import { generateCppMainCode } from "./main.js";
import { generateCppUtilityCode } from "./utility.js";
import { generateCppTestCaseCode } from "./test_case.js";

/**
 * Generates a C++ test file from a test schema.
 *
 * @param schema - The test schema.
 * @param solutionFile - The path of the C++ solution file.
 * @param outFile - The path of the C++ test file output.
 * @returns A promise that resolves to nothing.
 */
export async function generateCppTest(
  schema: Schema,
  solutionFile: string,
  outFile: string,
): Promise<void> {
  const main = generateCppMainCode(schema);

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
      generateCppTestCaseCode(schema),
      generateCppUtilityCode(schema),
      main.code,
    ].join("\n"),
  );
}
