export function stringifyError(err: unknown, indent: string): string {
  if (err instanceof Error) {
    return `${err.name}: ${err.message}`
      .split("\n")
      .map((line) => `${indent}${line}`)
      .join("\n");
  }
  return `${indent}Unknown error`;
}
