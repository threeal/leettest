import { expect, it, vi } from "vitest";

const spinnerOut: string[] = [];
vi.mock("ora", () => ({
  default: vi.fn(() => {
    return {
      start(text: string) {
        spinnerOut.push(`start: ${text}`);
      },
      succeed(text: string) {
        spinnerOut.push(`succeed: ${text}`);
      },
      fail(text: string) {
        spinnerOut.push(`fail: ${text}`);
      },
    };
  }),
}));

vi.mock("./test/cpp.js", () => ({
  testCppSolution: vi.fn(),
}));

it("should test solution files", async () => {
  const { testCppSolution } = await import("./test/cpp.js");
  const { testSolutions } = await import("./test.js");

  vi.mocked(testCppSolution).mockImplementation((solutionFile) => {
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

  expect(spinnerOut).toEqual([
    "start: Testing foo/solution.cpp...",
    "succeed: Tested foo/solution.cpp",
    "start: Testing bar/solution.cpp...",
    "fail: Failed to test bar/solution.cpp\n  unknown error\n",
    "start: Testing baz/solution.cpp...",
    "succeed: Tested baz/solution.cpp",
  ]);
});
