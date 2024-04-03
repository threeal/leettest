import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Schema } from "../schema.js";

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
    `#include <vector>`,
    ``,
  ];

  lines = lines.concat([
    `struct TestCase {`,
    `  const char* name;`,
    `  const struct {`,
    ...schema.cpp.function.inputs.map(
      (input, i) => `    const ${input.type} arg${i};`,
    ),
    `  } inputs;`,
    `  const ${schema.cpp.function.output.type} output;`,
    `};`,
    ``,
  ]);

  const testCases: string[] = [];

  for (const c of schema.cases) {
    const lines = [
      `  {`,
      `    "${c.name}",`,
      `    .inputs{`,
      schema.cpp.function.inputs
        .map((input) => `      ${c.inputs[input.value]}`)
        .join(",\n"),
      `    },`,
      `    ${c.output}`,
      `  }`,
    ];

    testCases.push(lines.join("\n"));
  }

  lines = lines.concat([
    `const std::vector<TestCase> test_cases{`,
    testCases.join(",\n"),
    `};`,
    ``,
  ]);

  lines = lines.concat([
    `int main() {`,
    `  int failures{0};`,
    `  for (const TestCase &t : test_cases) {`,
    `    std::cout << "testing " << t.name << "...\\n";`,
    `    Solution s{};`,
  ]);

  const params = schema.cpp.function.inputs
    .map((_, i) => `t.inputs.arg${i}`)
    .join(", ");
  lines.push(
    `    const ${schema.cpp.function.output.type} output{s.${schema.cpp.function.name}(${params})};`,
  );

  lines = lines.concat([
    `    if (output != t.output) {`,
    `      std::cerr << "failed to test " << t.name << ":\\n";`,
    `      std::cerr << ".  output: " << output << "\\n";`,
    `      std::cerr << ".  expected: " << t.output << "\\n\\n";`,
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
