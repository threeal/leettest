import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Schema } from "../schema.js";
import { generateCppMainCode } from "./generate/main.js";
import { generateCppTestCaseCode } from "./generate/test_case.js";

/**
 * Generates a C++ test file from a test schema.
 *
 * @param schema - The test schema.
 * @param solutionFile - The path of the C++ solution file.
 * @param outFile - The path of the C++ test file output.
 */
export function generateCppTest(
  schema: Schema,
  solutionFile: string,
  outFile: string,
): void {
  const lines: string[] = [
    `#include "${path.relative(path.dirname(outFile), solutionFile)}"`,
    ``,
    `#include <iostream>`,
    ``,
    generateCppTestCaseCode(schema),
    generateCppMainCode(schema),
  ];

  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, lines.join("\n"));
}
