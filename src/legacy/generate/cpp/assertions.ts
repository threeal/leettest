/**
 * Generates C++ code to assert the equality between two variables.
 *
 * @param actual - The name of the variable holding the actual value.
 * @param expected - The name of the variable holding the expected value.
 * @returns An object containing the generated C++ code and the required headers.
 */
export function generateCppEqualityAssertionCode(
  actual: string,
  expected: string,
): {
  code: string;
  requiredHeaders: Set<string>;
} {
  return {
    code: [
      `if (${actual} != ${expected}) {`,
      `  std::stringstream ss{};`,
      `  ss << "  actual: " << ${actual} << "\\n";`,
      `  ss << "  expected: " << ${expected};`,
      `  throw std::runtime_error(ss.str());`,
      `}`,
    ].join("\n"),
    requiredHeaders: new Set<string>(["sstream", "stdexcept"]),
  };
}
