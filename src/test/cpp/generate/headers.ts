/**
 * Generates C++ code for including headers.
 *
 * @param headers - Set of headers to include.
 * @returns The generated C++ code.
 */
export function generateCppIncludeHeadersCode(headers: Set<string>): string {
  return [...headers]
    .sort()
    .map((header) => `#include <${header}>`)
    .join("\n");
}
