import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("./cpp/index.js", () => ({
  testCppSolution: jest.fn(),
}));

it("should test solution files", async () => {
  const { testCppSolution } = await import("./cpp/index.js");
  const { testSolutions } = await import("./index.js");

  jest.mocked(testCppSolution).mockImplementation((solutionFile) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (solutionFile === "bar/solution.cpp") {
          reject(new Error("unknown error"));
        } else {
          resolve();
        }
      }, 1000);
    });
  });

  const prom = testSolutions([
    "foo/solution.cpp",
    "bar/solution.cpp",
    "baz/solution.cpp",
  ]);
  await expect(prom).resolves.toBe(1);
});
