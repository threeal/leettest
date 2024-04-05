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
      `#include "../../../path/to/solution.cpp"`,
      ``,
      `#include <iostream>`,
      ``,
      `struct TestCase {`,
      `  const char* name;`,
      `  struct {`,
      `    int arg0;`,
      `    int arg1;`,
      `  } inputs;`,
      `  int output;`,
      `};`,
      ``,
      `TestCase test_cases[2]{`,
      `  {`,
      `    "example 1",`,
      `    .inputs{`,
      `      12,`,
      `      5`,
      `    },`,
      `    17`,
      `  },`,
      `  {`,
      `    "example 2",`,
      `    .inputs{`,
      `      -10,`,
      `      4`,
      `    },`,
      `    -6`,
      `  }`,
      `};`,
      ``,
      `int main() {`,
      `  int failures{0};`,
      `  for (int i{0}; i < 2; ++i) {`,
      `    std::cout << "testing " << test_cases[i].name << "...\\n";`,
      `    Solution s{};`,
      `    const int output{s.sum(test_cases[i].inputs.arg0, test_cases[i].inputs.arg1)};`,
      `    if (output != test_cases[i].output) {`,
      `      std::cerr << "failed to test " << test_cases[i].name << ":\\n";`,
      `      std::cerr << ".  output: " << output << "\\n";`,
      `      std::cerr << ".  expected: " << test_cases[i].output << "\\n\\n";`,
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
