import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("glob", () => ({
  globSync: jest.fn((pattern) => {
    switch (pattern) {
      case "foo/solution.cpp":
        return ["foo/solution.cpp"];
      case "bar/**/solution.cpp":
        return ["bar/foo/solution.cpp", "bar/bar/solution.cpp"];
    }
    return [];
  }),
}));

it("should search for solution files", async () => {
  const { searchSolutions } = await import("./search.js");

  expect(searchSolutions(["foo/solution.cpp", "bar/**/solution.cpp"])).toEqual([
    "bar/bar/solution.cpp",
    "bar/foo/solution.cpp",
    "foo/solution.cpp",
  ]);
});
