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
    `#include <iostream>`,
    `#include <vector>`,
    ``,
    `#include "${path.relative(path.dirname(outFile), solutionFile)}"`,
    ``,
  ];

  lines = lines.concat([
    `struct TestCase {`,
    `  const char* name;`,
    `  struct {`,
    ...schema.cpp.function.inputs.map(
      (input) => `    ${input.type} ${input.name};`,
    ),
    `  } inputs;`,
    `  ${schema.cpp.function.output} output;`,
    `};`,
    ``,
  ]);

  const testCases: string[] = [];

  for (const name of Object.keys(schema.examples)) {
    const inputs: string[] = [];
    for (const input of schema.cpp.function.inputs) {
      inputs.push(
        `      .${input.name} = ${schema.examples[name].inputs[input.name]}`,
      );
    }

    const lines = [
      `  {`,
      `    .name = "example ${name}",`,
      `    .inputs{`,
      inputs.join(",\n"),
      `    },`,
      `    .output = ${schema.examples[name].output}`,
      `  }`,
    ];

    testCases.push(lines.join("\n"));
  }

  lines = lines.concat([
    `std::vector<TestCase> test_cases{`,
    testCases.join(",\n"),
    `};`,
    ``,
  ]);

  lines = lines.concat([
    `int main() {`,
    `  int failures{0};`,
    `  for (const auto &t : test_cases) {`,
    `    std::cout << "testing " << t.name << "...\\n";`,
    `    Solution s{};`,
  ]);

  const params: string[] = [];
  for (const input of schema.cpp.function.inputs) {
    params.push(`t.inputs.${input.name}`);
  }
  lines.push(
    `     auto output = s.${schema.cpp.function.name}(${params.join(", ")});`,
  );

  lines = lines.concat([
    `     if (output != t.output) {`,
    `       std::cerr << "failed to test " << t.name << ":\\n";`,
    `       std::cerr << "  inputs:\\n";`,
    ...schema.cpp.function.inputs.map(
      (input) =>
        `       std::cerr << "    ${input.name}: " << t.inputs.${input.name} << "\\n";`,
    ),
    `       std::cerr << "  output: " << output << "\\n";`,
    `       std::cerr << "  expected: " << t.output << "\\n\\n";`,
    `       ++failures;`,
    `     }`,
    `  }`,
    `  return failures;`,
    `}`,
    ``,
  ]);

  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, lines.join("\n"));
}
