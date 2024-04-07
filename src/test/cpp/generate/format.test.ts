import { formatCpp } from "./format.js";

describe("format values in C++ format", () => {
  it("should format an integer", () => {
    expect(formatCpp(123, "int")).toBe("123");
  });

  it("should format a string", () => {
    expect(formatCpp("something", "std::string")).toBe(`"something"`);
  });

  it("should format an array of integers", () => {
    expect(formatCpp([123, 234, 345], "std::vector<int>")).toBe(
      "{123, 234, 345}",
    );
  });

  it("should format an array of strings", () => {
    expect(formatCpp(["foo", "bar", "baz"], "std::vector<std::string>")).toBe(
      `{"foo", "bar", "baz"}`,
    );
  });
});
