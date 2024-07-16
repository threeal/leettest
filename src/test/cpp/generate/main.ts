import { Schema } from "../../schema.js";
import { formatCpp } from "./format.js";

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
      schema.cases
        .map((c) => {
          const f = schema.cpp.function;
          const params = f.inputs
            .map((i) => {
              return formatCpp(c.inputs[i.value], i.type);
            })
            .join(", ");
          return [
            `  {`,
            `    std::cout << "testing ${c.name}...\\n";`,
            `    const ${f.output.type} output = Solution{}.${f.name}(${params});`,
            `    const ${f.output.type} expected = ${formatCpp(c.output, f.output.type)};`,
            `    if (output != expected) {`,
            `      std::cerr << "failed to test ${c.name}:\\n";`,
            `      std::cerr << "  output: " << output << "\\n";`,
            `      std::cerr << "  expected: " << expected << "\\n\\n";`,
            `      ++failures;`,
            `    }`,
            `  }`,
          ].join("\n");
        })
        .join("\n"),
      `  if (failures > 0) std::cerr << failures << " test cases have failed\\n";`,
      `  return failures;`,
      `}`,
      ``,
    ].join("\n"),
    headers: new Set(["iostream"]),
  };
}
