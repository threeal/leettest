import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("node:child_process", () => ({
  execSync: jest.fn(),
}));

jest.unstable_mockModule("node:fs", () => ({
  mkdirSync: jest.fn(),
}));

it("should compile a C++ test file", async () => {
  const { execSync } = await import("node:child_process");
  const { mkdirSync } = await import("node:fs");
  const { compileCppTest } = await import("./cpp.js");

  const testExec = compileCppTest("path/to/test.cpp");

  expect(mkdirSync).toHaveBeenCalledExactlyOnceWith("build/path/to", {
    recursive: true,
  });
  expect(execSync).toHaveBeenCalledExactlyOnceWith(
    "clang++ --std=c++20 path/to/test.cpp -o build/path/to/test",
    {
      stdio: "inherit",
    },
  );
  expect(execSync).toHaveBeenCalledAfter(jest.mocked(mkdirSync));

  expect(testExec).toBe("build/path/to/test");
});
