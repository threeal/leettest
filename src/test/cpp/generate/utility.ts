import { Schema } from "../../schema.js";

export const cppVectorOfIntOstreamOperatorCode = [
  `std::ostream& operator<<(std::ostream& out, const std::vector<int>& arr) {`,
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
 * @param schema - The test schema.
 * @returns The generated C++ utility functions code.
 */
export function generateCppUtilityCode(schema: Schema): string {
  if (schema.cpp.function.output.type === "std::vector<int>") {
    return cppVectorOfIntOstreamOperatorCode;
  }

  return "";
}
