import { RawTestSchema } from "../../schema/raw.js";

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
 * @param schema - The raw test schema.
 * @returns The generated C++ utility functions code.
 */
export function generateCppUtilityCode(schema: RawTestSchema): string {
  if (schema.cpp.output.match(/^std::vector<.*>$/)) {
    return cppVectorOstreamOperatorCode;
  }

  return "";
}
