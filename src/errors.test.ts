import { describe, expect, test } from "vitest";
import { CompileError, ProcessError, RunError } from "./errors.js";

test("create a compile error", { concurrent: true }, () => {
  const err = new CompileError([new Error()], "main.cpp");
  expect(err.name).toBe("CompileError");
  expect(err.message).toBe("Failed to compile: main.cpp");
  expect(err.errors).toStrictEqual([new Error()]);
});

describe("create process errors", { concurrent: true }, () => {
  test("with code and output", () => {
    const err = new ProcessError(["cmd", "arg0", "arg1"], 9, " an output\n");
    expect(err.name).toBe("ProcessError");
    expect(err.message).toBe("Process failed (9): cmd arg0 arg1\nan output");
  });

  test("without code and output", () => {
    const err = new ProcessError(["cmd", "arg0", "arg1"], null, "\n");
    expect(err.name).toBe("ProcessError");
    expect(err.message).toBe("Process failed: cmd arg0 arg1");
  });
});

test("create a run error", { concurrent: true }, () => {
  const err = new RunError([new Error()], "main");
  expect(err.name).toBe("RunError");
  expect(err.message).toBe("Failed to run: main");
  expect(err.errors).toStrictEqual([new Error()]);
});
