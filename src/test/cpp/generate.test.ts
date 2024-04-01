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
        inputs: [
          { name: "num1", type: "int" },
          { name: "num2", type: "int" },
        ],
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
      `#include <vector>`,
      ``,
      `#include "../../../path/to/solution.cpp"`,
      ``,
      `struct TestCase {`,
      `  const char* name;`,
      `  struct {`,
      `    int num1;`,
      `    int num2;`,
      `  } inputs;`,
      `  int output;`,
      `};`,
      ``,
      `std::vector<TestCase> test_cases{`,
      `  {`,
      `    .name = "example 1",`,
      `    .inputs{`,
      `      .num1 = 12,`,
      `      .num2 = 5`,
      `    },`,
      `    .output = 17`,
      `  },`,
      `  {`,
      `    .name = "example 2",`,
      `    .inputs{`,
      `      .num1 = -10,`,
      `      .num2 = 4`,
      `    },`,
      `    .output = -6`,
      `  }`,
      `};`,
      ``,
      `int main() {`,
      `  int failures{0};`,
      `  for (const auto &t : test_cases) {`,
      `    std::cout << "testing " << t.name << "...\\n";`,
      `    Solution s{};`,
      `     auto output = s.sum(t.inputs.num1, t.inputs.num2);`,
      `     if (output != t.output) {`,
      `       std::cerr << "failed to test " << t.name << ":\\n";`,
      `       std::cerr << ".  inputs:\\n";`,
      `       std::cerr << ".    num1: " << t.inputs.num1 << "\\n";`,
      `       std::cerr << ".    num2: " << t.inputs.num2 << "\\n";`,
      `       std::cerr << ".  output: " << output << "\\n";`,
      `       std::cerr << ".  expected: " << t.output << "\\n\\n";`,
      `       ++failures;`,
      `     }`,
      `  }`,
      `  if (failures > 0) std::cerr << failures << " test cases have failed\\n";`,
      `  return failures;`,
      `}`,
      ``,
    ].join("\n"),
  );
});
