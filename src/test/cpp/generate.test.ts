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
          { type: "int", value: "num1" },
          { type: "int", value: "num2" },
        ],
        output: { type: "int" },
      },
    },
    cases: [
      {
        name: "example 1",
        inputs: {
          num1: 12,
          num2: 5,
        },
        output: 17,
      },
      {
        name: "example 2",
        inputs: {
          num1: -10,
          num2: 4,
        },
        output: -6,
      },
    ],
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
      `  const struct {`,
      `    const int arg0;`,
      `    const int arg1;`,
      `  } inputs;`,
      `  const int output;`,
      `};`,
      ``,
      `const std::vector<TestCase> test_cases{`,
      `  {`,
      `    .name{"example 1"},`,
      `    .inputs{`,
      `      .arg0{12},`,
      `      .arg1{5}`,
      `    },`,
      `    .output{17}`,
      `  },`,
      `  {`,
      `    .name{"example 2"},`,
      `    .inputs{`,
      `      .arg0{-10},`,
      `      .arg1{4}`,
      `    },`,
      `    .output{-6}`,
      `  }`,
      `};`,
      ``,
      `int main() {`,
      `  int failures{0};`,
      `  for (const TestCase &t : test_cases) {`,
      `    std::cout << "testing " << t.name << "...\\n";`,
      `    Solution s{};`,
      `    const int output{s.sum(t.inputs.arg0, t.inputs.arg1)};`,
      `    if (output != t.output) {`,
      `      std::cerr << "failed to test " << t.name << ":\\n";`,
      `      std::cerr << ".  output: " << output << "\\n";`,
      `      std::cerr << ".  expected: " << t.output << "\\n\\n";`,
      `      ++failures;`,
      `    }`,
      `  }`,
      `  if (failures > 0) std::cerr << failures << " test cases have failed\\n";`,
      `  return failures;`,
      `}`,
      ``,
    ].join("\n"),
  );
});
