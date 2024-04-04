import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("node:child_process", () => ({
  execSync: jest.fn(),
}));

jest.unstable_mockModule("node:fs", () => ({
  mkdirSync: jest.fn(),
}));

beforeEach(async () => {
  const { execSync } = await import("node:child_process");
  const { mkdirSync } = await import("node:fs");

  jest.mocked(execSync).mockClear();
  jest.mocked(mkdirSync).mockClear();
});

it("should compile a C++ test file", async () => {
  const { execSync } = await import("node:child_process");
  const { mkdirSync } = await import("node:fs");
  const { compileCppTest } = await import("./compile.js");

  compileCppTest("path/to/test.cpp", "build/path/to/test");

  expect(mkdirSync).toHaveBeenCalledExactlyOnceWith("build/path/to", {
    recursive: true,
  });
  expect(execSync).toHaveBeenCalledExactlyOnceWith(
    "clang++ --std=c++20 -O2 path/to/test.cpp -o build/path/to/test",
    { stdio: "pipe" },
  );
  expect(execSync).toHaveBeenCalledAfter(jest.mocked(mkdirSync));
});
