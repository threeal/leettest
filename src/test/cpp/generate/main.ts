import { RawTestSchema } from "../../schema.js";
import { formatCpp } from "./format.js";

/**
 * Generates C++ main function code from a test schema.
 *
 * @param schema - The raw test schema.
 * @returns An object containing the generated C++ code and a set of required headers.
 */
export function generateCppMainCode(schema: RawTestSchema): {
  code: string;
  headers: Set<string>;
} {
  return {
    code: [
      `int main() {`,
      `  int failures{0};`,
      schema.cases
        .map((c) => {
          const funName = schema.cpp.function.name;
          const funArgs = schema.cpp.function.arguments
            .map((arg) => {
              return formatCpp(c.inputs[arg], schema.cpp.inputs[arg]);
            })
            .join(", ");
          const outType = schema.cpp.output;
          return [
            `  {`,
            `    std::cout << "testing ${c.name}...\\n";`,
            `    const ${outType} output = Solution{}.${funName}(${funArgs});`,
            `    const ${outType} expected = ${formatCpp(c.output, outType)};`,
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
