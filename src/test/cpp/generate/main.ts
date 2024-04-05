import { Schema } from "../../schema.js";

/**
 * Generates C++ main function code from a test schema.
 *
 * @param schema - The test schema.
 * @returns An object containing the generated C++ code and a set of required headers.
 */
export function generateCppMainCode(schema: Schema): {
  code: string;
  headers: Set<string>;
} {
  return {
    code: [
      `int main() {`,
      `  int failures{0};`,
      `  for (int i{0}; i < ${schema.cases.length}; ++i) {`,
      `    std::cout << "testing " << test_cases[i].name << "...\\n";`,
      `    Solution s{};`,
      (() => {
        const params = schema.cpp.function.inputs
          .map((_, i) => `test_cases[i].inputs.arg${i}`)
          .join(", ");
        return `    const ${schema.cpp.function.output.type} output{s.${schema.cpp.function.name}(${params})};`;
      })(),
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
    ].join("\n"),
    headers: new Set(["iostream"]),
  };
}
