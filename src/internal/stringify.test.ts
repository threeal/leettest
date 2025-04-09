import { describe, expect, test } from "vitest";
import { stringifyError } from "./stringify.js";

describe("stringify errors", { concurrent: true }, () => {
  test("error", () => {
    const err = new Error("a message");
    expect(stringifyError(err, "  ")).toBe("  Error: a message");
  });

  test("unknown error", () => {
    expect(stringifyError("unknown", "  ")).toBe("  Unknown error");
  });
});
