import { CppTestSchema } from "../../schema/cpp.js";
import { formatCpp } from "./format.js";

/**
 * Generates C++ main function code from a test schema.
 *
 * @param schema - The C++ test schema.
 * @returns An object containing the generated C++ code and a set of required headers.
 */
export function generateCppMainCode(schema: CppTestSchema): {
  code: string;
  headers: Set<string>;
} {
  return {
    code: [
      `int main() {`,
      `  int failures{0};`,
      schema.cases
        .map((c) => {
          const funName = c.function.name;
          const funArgs = c.function.arguments.join(", ");
          return [
            `  {`,
            `    std::cout << "testing ${c.name}...\\n";`,
            ...Object.entries(c.inputs).map(([name, { type, value }]) => {
              return `    ${type} ${name} = ${formatCpp(value, type)};`;
            }),
            `    const ${c.output.type} output = Solution{}.${funName}(${funArgs});`,
            `    const ${c.output.type} expected = ${formatCpp(c.output.value, c.output.type)};`,
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
