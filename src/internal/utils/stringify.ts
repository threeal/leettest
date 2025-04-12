export function stringifyError(err: unknown, indent: string): string {
  if (err instanceof Error) {
    let message = err.message;
    if (err instanceof AggregateError && err.errors.length > 0) {
      message += "\n";
      message += err.errors
        .map((err) => "✖" + stringifyError(err, "  ").slice(1))
        .join("\n");
    }
    return message
      .split("\n")
      .map((line) => `${indent}${line}`)
      .join("\n");
  }
  return `${indent}Unknown reason`;
}
