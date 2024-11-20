import { CppTestSchema } from "../../schema/cpp.js";
import { indentCode } from "../utils.js";
import { generateCppEqualityAssertionCode } from "./assertions.js";
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
  let headers = new Set<string>(["exception", "iostream"]);
  return {
    code: [
      `int main() {`,
      `  int failures{0};`,
      indentCode(
        schema.cases
          .map((c) => {
            const funName = c.function.name;
            const funArgs = c.function.arguments.join(", ");

            const equalityAssertion = generateCppEqualityAssertionCode(
              "actualOutput",
              c.output.name,
            );
            headers = new Set<string>([
              ...headers,
              ...equalityAssertion.requiredHeaders,
            ]);

            return [
              `{`,
              `  std::cout << "testing ${c.name}...\\n";`,
              ...[...c.inputs, c.output].map((input) => {
                const varDeclaration =
                  generateCppVariableDeclarationCode(input);
                headers = new Set<string>([
                  ...headers,
                  ...varDeclaration.requiredHeaders,
                ]);
                return indentCode(varDeclaration.code, "  ");
              }),
              `  try {`,
              `    const ${c.output.type} actualOutput = Solution{}.${funName}(${funArgs});`,
              indentCode(equalityAssertion.code, "    "),
              `  } catch (std::exception& e) {`,
              `    std::cerr << "failed to test ${c.name}:\\n" << e.what() << "\\n\\n";`,
              `    ++failures;`,
              `  }`,
              `}`,
            ].join("\n");
          })
          .join("\n"),
        "  ",
      ),
      `  if (failures > 0) std::cerr << failures << " test cases have failed\\n";`,
      `  return failures;`,
      `}`,
      ``,
    ].join("\n"),
    headers,
  };
}
