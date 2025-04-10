import { describe, expect, test } from "vitest";
import { CompileError, OutputError, ProcessError, RunError } from "./errors.js";

test("create a compile error", { concurrent: true }, () => {
  const err = new CompileError([new Error()], "main.cpp");
  expect(err.name).toBe("CompileError");
  expect(err.message).toBe("Failed to compile: main.cpp");
  expect(err.errors).toStrictEqual([new Error()]);
});

test("create an output error", { concurrent: true }, () => {
  const err = new OutputError(Buffer.from("a message"));
  expect(err.name).toBe("OutputError");
  expect(err.message).toBe("a message");
});

describe("create process errors", { concurrent: true }, () => {
  test("with code", () => {
    const err = new ProcessError([new Error()], ["cmd", "arg0", "arg1"], 9);
    expect(err.name).toBe("ProcessError");
    expect(err.message).toBe("Process failed (9): cmd arg0 arg1");
    expect(err.errors).toStrictEqual([new Error()]);
  });

  test("without code", () => {
    const err = new ProcessError([new Error()], ["cmd", "arg0", "arg1"], null);
    expect(err.name).toBe("ProcessError");
    expect(err.message).toBe("Process failed: cmd arg0 arg1");
    expect(err.errors).toStrictEqual([new Error()]);
  });
});

test("create a run error", { concurrent: true }, () => {
  const err = new RunError([new Error()], "main");
  expect(err.name).toBe("RunError");
  expect(err.message).toBe("Failed to run: main");
  expect(err.errors).toStrictEqual([new Error()]);
});
