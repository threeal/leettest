/**
 * A class for managing and generating C++ header include directives.
 */
export class CppHeaders {
  #headers: Set<string>;

  /**
   * Creates an instance of the `CppHeaders` class with the given initial headers.
   *
   * @param headers - The initial headers.
   */
  constructor(headers: string[]) {
    this.#headers = new Set<string>(headers);
  }

  /**
   * Adds a new header to the object if it doesn't already exist.
   *
   * @param header - The new header to add.
   */
  add(header: string): void {
    this.#headers.add(header);
  }

  /**
   * Generates C++ code for including headers.
   *
   * @returns The generated C++ code.
   */
  generateCode(): string {
    return [...this.#headers]
      .sort()
      .map((header) => `#include <${header}>`)
      .join("\n");
  }
}

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
