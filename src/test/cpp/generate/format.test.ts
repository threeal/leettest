import { formatCpp } from "./format.js";

describe("format values in C++ format", () => {
  it("should format an integer", () => {
    expect(formatCpp(123, "int")).toBe("123");
  });

  it("should format a string", () => {
    expect(formatCpp("something", "std::string")).toBe(`"something"`);
  });
});
