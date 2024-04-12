/**
 * Formats a value to a string in C++ format.
 *
 * @param value - The value to format.
 * @param type - The target C++ type.
 * @returns A string representation of the value in C++ format.
 */
export function formatCpp(value: unknown, type: string): string {
  switch (type) {
    case "std::string":
      return `"${value}"`;
    case "char":
      return `'${value}'`;
  }

  if (type.match(/^std::vector<.*>$/)) {
    const subtype = type.substring(12, type.length - 1);
    return `{${(value as unknown[]).map((v) => formatCpp(v, subtype)).join(", ")}}`;
  }

  return `${value}`;
}
