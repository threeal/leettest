import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("node:child_process", () => ({
  execSync: jest.fn(),
}));

jest.unstable_mockModule("node:fs/promises", () => ({
  mkdir: jest.fn(),
}));

beforeEach(async () => {
  const { execSync } = await import("node:child_process");
  const { mkdir } = await import("node:fs/promises");

  jest.mocked(execSync).mockClear();
  jest.mocked(mkdir).mockClear();
});

it("should compile a C++ test file", async () => {
  const { execSync } = await import("node:child_process");
  const { mkdir } = await import("node:fs/promises");
  const { compileCppTest } = await import("./compile.js");

  await expect(
    compileCppTest("path/to/test.cpp", "build/path/to/test"),
  ).resolves.toBeUndefined();

  expect(mkdir).toHaveBeenCalledExactlyOnceWith("build/path/to", {
    recursive: true,
  });
  expect(execSync).toHaveBeenCalledExactlyOnceWith(
    "clang++ --std=c++20 -O2 path/to/test.cpp -o build/path/to/test",
    { stdio: "pipe" },
  );
  expect(execSync).toHaveBeenCalledAfter(jest.mocked(mkdir));
});
