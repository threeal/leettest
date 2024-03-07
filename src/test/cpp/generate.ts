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
    `#include <tuple>`,
    `#include <vector>`,
    ``,
    `#include "${path.relative(path.dirname(outFile), solutionFile)}"`,
    ``,
  ];

  lines = lines.concat([
    `struct TestCase {`,
    `  const char* name;`,
    `  std::tuple<${schema.cpp.function.inputs.join(", ")}> inputs;`,
    `  ${schema.cpp.function.output} output;`,
    `};`,
    ``,
  ]);

  const testCases: string[] = [];

  for (const name of Object.keys(schema.examples)) {
    const inputs: string[] = [];
    for (const input of Object.keys(schema.examples[name].inputs)) {
      inputs.push(`      ${schema.examples[name].inputs[input]}`);
    }

    const lines = [
      `  {`,
      `    .name = "${name}",`,
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
    `  for (const auto &t : test_cases) {`,
    `    std::cout << "Testing " << t.name << "...\\n";`,
    `    Solution s{};`,
  ]);

  const params: string[] = [];
  for (let i = 0; i < schema.cpp.function.inputs.length; ++i) {
    params.push(`std::get<${i}>(t.inputs)`);
  }
  lines.push(
    `     auto output = s.${schema.cpp.function.name}(${params.join(", ")});`,
  );

  lines = lines.concat([
    `     if (output != t.output) {`,
    `       std::cerr << "Wrong output: " << output << " != " << t.output << " \\n";`,
    `       return 1;`,
    `     }`,
    `  }`,
    `  return 0;`,
    `}`,
    ``,
  ]);

  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, lines.join("\n"));
}
