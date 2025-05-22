import { describe, expect, test } from "vitest";

import {
  AssertionError,
  CompileError,
  ProcessError,
  ReadError,
  RunError,
  TestError,
} from "./errors.js";

test("create an assertion error", { concurrent: true }, () => {
  const err = new AssertionError("name", "actual", "expected");
  expect(err.name).toBe("AssertionError");
  expect(err.message).toBe(
    "Failed to assert: name\nActual: actual\nExpected: expected",
  );
});

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

test("create a read error", { concurrent: true }, () => {
  const err = new ReadError([new Error()], "file.txt");
  expect(err.name).toBe("ReadError");
  expect(err.message).toBe("Failed to read: file.txt");
  expect(err.errors).toStrictEqual([new Error()]);
});

test("create a run error", { concurrent: true }, () => {
  const err = new RunError([new Error()], "main");
  expect(err.name).toBe("RunError");
  expect(err.message).toBe("Failed to run: main");
  expect(err.errors).toStrictEqual([new Error()]);
});

test("create a test error", { concurrent: true }, () => {
  const err = new TestError([new Error()], "main");
  expect(err.name).toBe("TestError");
  expect(err.message).toBe("Failed to test: main");
  expect(err.errors).toStrictEqual([new Error()]);
});
