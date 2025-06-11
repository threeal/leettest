export class AssertionError extends Error {
  constructor(name: string, actual: string, expected: string) {
    super(
      `Failed to assert: ${name}\nActual: ${actual}\nExpected: ${expected}`,
    );

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class CompileError extends AggregateError {
  constructor(error: unknown[], file: string) {
    super(error, `Failed to compile: ${file}`);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ProcessError extends Error {
  constructor(args: readonly string[], code: number | null, output: string) {
    let message = "Process failed";
    if (code !== null) message += ` (${code.toString()})`;
    message += `: ${args.join(" ")}`;

    const trimmedOutput = output.trim();
    if (trimmedOutput !== "") message += `\n${trimmedOutput}`;

    super(message);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ReadError extends AggregateError {
  constructor(error: unknown[], file: string) {
    super(error, `Failed to read: ${file}`);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class RunError extends AggregateError {
  constructor(error: unknown[], file: string) {
    super(error, `Failed to run: ${file}`);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class TestError extends AggregateError {
  constructor(error: unknown[], file: string) {
    super(error, `Failed to test: ${file}`);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
