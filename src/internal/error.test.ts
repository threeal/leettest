import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./error.js";

describe("retrieve error messages", () => {
  it("should retrieve the error message", async () => {
    const err = new Error("a message");
    expect(getErrorMessage(err)).toBe(err.message);
  });

  it("should not retrieve the error message", async () => {
    expect(getErrorMessage(null)).toBe("unknown error");
  });
});
