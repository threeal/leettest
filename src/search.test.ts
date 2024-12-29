import { expect, it, vi } from "vitest";

vi.mock("glob", () => ({
  globSync: vi.fn((pattern) => {
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
