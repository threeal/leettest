export class AssertionError extends Error {
  actual: string;
  expected: string;

  constructor(actual: string, expected: string) {
    super(`Actual: ${actual}\nExpected: ${expected}`);

    this.name = this.constructor.name;
    this.actual = actual;
    this.expected = expected;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class CompileError extends AggregateError {
  constructor(error: unknown[], file: string) {
    super(error, `Failed to compile: ${file}`);

    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ProcessError extends Error {
  constructor(args: readonly string[], code: number | null, output: string) {
    let message = "Process failed";
    if (code !== null) message += ` (${code})`;
    message += `: ${args.join(" ")}`;

    const trimmedOutput = output.trim();
    if (trimmedOutput !== "") message += `\n${trimmedOutput}`;

    super(message);

    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ReadError extends AggregateError {
  file: string;

  constructor(error: unknown[], file: string) {
    super(error, `Failed to read: ${file}`);

    this.name = this.constructor.name;
    this.file = file;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class RunError extends AggregateError {
  constructor(error: unknown[], file: string) {
    super(error, `Failed to run: ${file}`);

    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class TestError extends AggregateError {
  file: string;

  constructor(error: unknown[], file: string) {
    super(error, `Failed to test: ${file}`);

    this.name = this.constructor.name;
    this.file = file;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
