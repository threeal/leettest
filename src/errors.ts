export class CompileError extends AggregateError {
  file: string;

  constructor(error: unknown[], file: string) {
    super(error, `Failed to compile: ${file}`);

    this.name = this.constructor.name;
    this.file = file;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class DownloadError extends AggregateError {
  url: string;

  constructor(error: unknown[], url: string) {
    super(error, `Failed to download from: ${url}`);

    this.name = this.constructor.name;
    this.url = url;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class HttpResponseError extends Error {
  code: number | undefined;

  constructor(code: number | undefined) {
    super(`HTTP responded with status code: ${code}`);

    this.name = this.constructor.name;
    this.code = code;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ProcessError extends Error {
  args: readonly string[];
  code: number | null;
  output: string;

  constructor(args: readonly string[], code: number | null, output: string) {
    let message = "Process failed";
    if (code !== null) message += ` (${code})`;
    message += `: ${args.join(" ")}`;

    const trimmedOutput = output.trim();
    if (trimmedOutput !== "") message += `\n${trimmedOutput}`;

    super(message);

    this.name = this.constructor.name;
    this.args = args;
    this.code = code;
    this.output = output;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class RunError extends AggregateError {
  file: string;

  constructor(error: unknown[], file: string) {
    super(error, `Failed to run: ${file}`);

    this.name = this.constructor.name;
    this.file = file;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
