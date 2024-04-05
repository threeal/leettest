import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Schema } from "../schema.js";
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
  let lines: string[] = [
    `#include "${path.relative(path.dirname(outFile), solutionFile)}"`,
    ``,
    `#include <iostream>`,
    ``,
  ];

  lines.push(generateCppTestCaseCode(schema));

  lines = lines.concat([
    `int main() {`,
    `  int failures{0};`,
    `  for (int i{0}; i < ${schema.cases.length}; ++i) {`,
    `    std::cout << "testing " << test_cases[i].name << "...\\n";`,
    `    Solution s{};`,
  ]);

  const params = schema.cpp.function.inputs
    .map((_, i) => `test_cases[i].inputs.arg${i}`)
    .join(", ");
  lines.push(
    `    const ${schema.cpp.function.output.type} output{s.${schema.cpp.function.name}(${params})};`,
  );

  lines = lines.concat([
    `    if (output != test_cases[i].output) {`,
    `      std::cerr << "failed to test " << test_cases[i].name << ":\\n";`,
    `      std::cerr << ".  output: " << output << "\\n";`,
    `      std::cerr << ".  expected: " << test_cases[i].output << "\\n\\n";`,
    `      ++failures;`,
    `    }`,
    `  }`,
    `  if (failures > 0) std::cerr << failures << " test cases have failed\\n";`,
    `  return failures;`,
    `}`,
    ``,
  ]);

  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, lines.join("\n"));
}
