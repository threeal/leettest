import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("./cpp/compile.js", () => ({
  compileCppTest: jest.fn(),
}));

jest.unstable_mockModule("./cpp/run.js", () => ({
  runCppTest: jest.fn(),
}));

it("should test a C++ solution", async () => {
  const { compileCppTest } = await import("./cpp/compile.js");
  const { runCppTest } = await import("./cpp/run.js");
  const { testCppSolution } = await import("./cpp.js");

  testCppSolution("path/to/solution.cpp");

  expect(compileCppTest).toHaveBeenCalledExactlyOnceWith(
    "path/to/test.cpp",
    "build/path/to/test",
  );
  expect(runCppTest).toHaveBeenCalledAfter(jest.mocked(compileCppTest));
  expect(runCppTest).toHaveBeenCalledExactlyOnceWith("build/path/to/test");
});
