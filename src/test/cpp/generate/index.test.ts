import { jest } from "@jest/globals";
import path from "node:path";
import { Schema } from "../../schema.js";
import "jest-extended";

jest.unstable_mockModule("node:fs/promises", () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
}));

jest.unstable_mockModule("./main.js", () => ({
  generateCppMainCode: jest.fn(),
}));

jest.unstable_mockModule("./test_case.js", () => ({
  generateCppTestCaseCode: jest.fn(),
}));

jest.unstable_mockModule("./utility.js", () => ({
  generateCppUtilityCode: jest.fn(),
}));

it("should generate a C++ test file", async () => {
  const { mkdir, writeFile } = await import("node:fs/promises");
  const { generateCppMainCode } = await import("./main.js");
  const { generateCppTest } = await import("./index.js");
  const { generateCppTestCaseCode } = await import("./test_case.js");
  const { generateCppUtilityCode } = await import("./utility.js");

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

  jest.mocked(generateCppMainCode).mockReturnValue({
    code: "// C++ main function code",
    headers: new Set(["iostream", "utility"]),
  });

  jest.mocked(generateCppTestCaseCode).mockReturnValue("// C++ test case code");
  jest.mocked(generateCppUtilityCode).mockReturnValue("// C++ utility code");

  await expect(
    generateCppTest(schema, "path/to/solution.cpp", "build/path/to/test.cpp"),
  ).resolves.toBeUndefined();

  expect(mkdir).toHaveBeenCalledExactlyOnceWith("build/path/to", {
    recursive: true,
  });

  expect(writeFile).toHaveBeenCalledAfter(jest.mocked(mkdir));
  expect(writeFile).toHaveBeenCalledExactlyOnceWith(
    "build/path/to/test.cpp",
    [
      `#include "${path.join("..", "..", "..", "path", "to", "solution.cpp")}"`,
      ``,
      `#include <iostream>`,
      `#include <utility>`,
      ``,
      `// C++ test case code`,
      `// C++ main function code`,
    ].join("\n"),
  );
});
