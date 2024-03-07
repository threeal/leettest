import { jest } from "@jest/globals";
import { Schema } from "../schema.js";
import "jest-extended";

jest.unstable_mockModule("node:fs", () => ({
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

it("should generate a C++ test file", async () => {
  const { mkdirSync, writeFileSync } = await import("node:fs");
  const { generateCppTest } = await import("./generate.js");

  const schema: Schema = {
    cpp: {
      function: {
        name: "sum",
        inputs: ["int", "int"],
        output: "int",
      },
    },
    examples: {
      1: {
        inputs: {
          num1: 12,
          num2: 5,
        },
        output: 17,
      },
      2: {
        inputs: {
          num1: -10,
          num2: 4,
        },
        output: -6,
      },
    },
  };

  generateCppTest(schema, "path/to/solution.cpp", "build/path/to/test.cpp");

  expect(mkdirSync).toHaveBeenCalledExactlyOnceWith("build/path/to", {
    recursive: true,
  });

  expect(writeFileSync).toHaveBeenCalledAfter(jest.mocked(mkdirSync));
  expect(writeFileSync).toHaveBeenCalledOnce();

  const writeFileSyncCall = jest.mocked(writeFileSync).mock.calls[0];
  expect(writeFileSyncCall[0]).toBe("build/path/to/test.cpp");
  expect(writeFileSyncCall[1]).toBe(
    [
      `#include <iostream>`,
      `#include <tuple>`,
      `#include <vector>`,
      ``,
      `#include "../../../path/to/solution.cpp"`,
      ``,
      `struct TestCase {`,
      `  const char* name;`,
      `  std::tuple<int, int> inputs;`,
      `  int output;`,
      `};`,
      ``,
      `std::vector<TestCase> test_cases{`,
      `  {`,
      `    .name = "example 1",`,
      `    .inputs{`,
      `      12,`,
      `      5`,
      `    },`,
      `    .output = 17`,
      `  },`,
      `  {`,
      `    .name = "example 2",`,
      `    .inputs{`,
      `      -10,`,
      `      4`,
      `    },`,
      `    .output = -6`,
      `  }`,
      `};`,
      ``,
      `int main() {`,
      `  for (const auto &t : test_cases) {`,
      `    std::cout << "Testing " << t.name << "...\\n";`,
      `    Solution s{};`,
      `     auto output = s.sum(std::get<0>(t.inputs), std::get<1>(t.inputs));`,
      `     if (output != t.output) {`,
      `       std::cerr << "Wrong output: " << output << " != " << t.output << " \\n";`,
      `       return 1;`,
      `     }`,
      `  }`,
      `  return 0;`,
      `}`,
      ``,
    ].join("\n"),
  );
});
