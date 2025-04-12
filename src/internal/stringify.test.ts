import { describe, expect, test } from "vitest";
import { stringifyError } from "./stringify.js";

describe("stringify errors", { concurrent: true }, () => {
  test("error", () => {
    const err = new Error("an error\na description");
    expect(stringifyError(err, "  ")).toBe("  an error\n  a description");
  });

  test("aggregated error", () => {
    const err = new AggregateError(
      [new Error("an error"), new Error("another error\na description")],
      "an error\na description",
    );

    expect(stringifyError(err, "  ")).toBe(
      [
        "  an error",
        "  a description",
        "  ✖ an error",
        "  ✖ another error",
        "    a description",
      ].join("\n"),
    );
  });

  test("unknown error", () => {
    expect(stringifyError("unknown", "  ")).toBe("  Unknown reason");
  });
});
