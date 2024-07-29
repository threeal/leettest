import { CppTestSchema } from "../../../schema/cpp.js";

export const cppVectorOstreamOperatorCode = [
  `template <typename T>`,
  `std::ostream& operator<<(std::ostream& out, const std::vector<T>& arr) {`,
  `  out << '{';`,
  `  if (arr.size() > 0) {`,
  `    out << arr[0];`,
  `    for (std::size_t i{1}; i < arr.size(); ++i) {`,
  `      out << ", " << arr[i];`,
  `    }`,
  `  }`,
  `  return out << '}';`,
  `}`,
  ``,
].join("\n");

/**
 * Generates C++ utility functions code from a test schema.
 *
 * @param schema - The C++ test schema.
 * @returns The generated C++ utility functions code.
 */
export function generateCppUtilityCode(schema: CppTestSchema): string {
  if (
    schema.cases.some(({ output }) => output.type.match(/^std::vector<.*>$/))
  ) {
    return cppVectorOstreamOperatorCode;
  }

  return "";
}
