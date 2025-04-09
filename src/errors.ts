export class CompileError extends AggregateError {
  file: string;

  constructor(error: unknown[], file: string) {
    super(error, `Failed to compile: ${file}`);

    this.name = this.constructor.name;
    this.file = file;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class OutputError extends Error {
  constructor(buffer: Buffer) {
    super(buffer.toString());
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ProcessError extends AggregateError {
  args: readonly string[];
  code: number | null;

  constructor(errs: unknown[], args: readonly string[], code: number | null) {
    let message = "Process failed";
    if (code !== null) message += ` (${code})`;
    message += `: ${args.join(" ")}`;

    super(errs, message);

    this.name = this.constructor.name;
    this.args = args;
    this.code = code;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
