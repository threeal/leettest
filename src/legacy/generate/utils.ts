/**
 * Indents each line of the given code with a specified indentation string.
 *
 * @param code - The code to indent.
 * @param indentation - The string used for indentation.
 * @returns The indented code.
 */
export function indentCode(code: string, indentation: string): string {
  return code
    .split("\n")
    .map((line) => `${indentation}${line}`)
    .join("\n");
}
