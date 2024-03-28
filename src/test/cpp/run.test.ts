import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("node:child_process", () => ({
  execSync: jest.fn(),
}));

it("should run a C++ test executable", async () => {
  const { execSync } = await import("node:child_process");
  const { runCppTest } = await import("./run.js");

  runCppTest("build/path/to/test");

  expect(execSync).toHaveBeenCalledExactlyOnceWith("build/path/to/test");
});
