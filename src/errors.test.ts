import { describe, expect, test } from "vitest";
import { OutputError, ProcessError } from "./errors.js";

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
