import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("node:child_process", () => ({
  exec: jest.fn((_, callback: () => void) => callback()),
}));

it("should run a C++ test executable", async () => {
  const { exec } = await import("node:child_process");
  const { runCppTest } = await import("./run.js");

  jest.mocked(exec).mockClear();

  await expect(runCppTest("build/path/to/test")).resolves.toBeUndefined();

  expect(jest.mocked(exec).mock.calls[0][0]).toBe("build/path/to/test");
});

it("should run a C++ test executable on Windows", async () => {
  const { exec } = await import("node:child_process");
  const { runCppTest } = await import("./run.js");

  jest.mocked(exec).mockClear();
  Object.defineProperty(process, "platform", { value: "win32" });

  await expect(runCppTest("build/path/to/test")).resolves.toBeUndefined();

  expect(jest.mocked(exec).mock.calls[0][0]).toBe("start build/path/to/test");
});
