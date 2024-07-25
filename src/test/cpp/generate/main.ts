import { CppTestSchema } from "../../schema/cpp.js";
import { generateCppVariableDeclarationCode } from "./variable.js";

/**
 * Generates C++ main function code from a test schema.
 *
 * @param schema - The C++ test schema.
 * @returns An object containing the generated C++ code and the required headers.
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
            ...[...c.inputs, c.output].map(
              (input) => `    ${generateCppVariableDeclarationCode(input)}`,
            ),
            `    const ${c.output.type} actualOutput = Solution{}.${funName}(${funArgs});`,
            `    if (actualOutput != ${c.output.name}) {`,
            `      std::cerr << "failed to test ${c.name}:\\n";`,
            `      std::cerr << "  actual: " << actualOutput << "\\n";`,
            `      std::cerr << "  expected: " << ${c.output.name} << "\\n\\n";`,
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
