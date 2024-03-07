import { jest } from "@jest/globals";
import { Schema } from "./schema.js";
import "jest-extended";

jest.unstable_mockModule("./cpp/compile.js", () => ({
  compileCppTest: jest.fn(),
}));

jest.unstable_mockModule("./cpp/generate.js", () => ({
  generateCppTest: jest.fn(),
}));

jest.unstable_mockModule("./cpp/run.js", () => ({
  runCppTest: jest.fn(),
}));

jest.unstable_mockModule("./schema.js", () => ({
  readYamlSchema: jest.fn(),
}));

it("should test a C++ solution", async () => {
  const { compileCppTest } = await import("./cpp/compile.js");
  const { generateCppTest } = await import("./cpp/generate.js");
  const { runCppTest } = await import("./cpp/run.js");
  const { testCppSolution } = await import("./cpp.js");
  const { readYamlSchema } = await import("./schema.js");

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

  jest.mocked(readYamlSchema).mockReturnValue(schema);

  testCppSolution("path/to/solution.cpp");

  expect(readYamlSchema).toHaveBeenCalledExactlyOnceWith("path/to/test.yaml");

  expect(generateCppTest).toHaveBeenCalledAfter(jest.mocked(readYamlSchema));
  expect(generateCppTest).toHaveBeenCalledExactlyOnceWith(
    schema,
    "path/to/solution.cpp",
    "build/path/to/test.cpp",
  );

  expect(compileCppTest).toHaveBeenCalledAfter(jest.mocked(generateCppTest));
  expect(compileCppTest).toHaveBeenCalledExactlyOnceWith(
    "build/path/to/test.cpp",
    "build/path/to/test",
  );

  expect(runCppTest).toHaveBeenCalledAfter(jest.mocked(compileCppTest));
  expect(runCppTest).toHaveBeenCalledExactlyOnceWith("build/path/to/test");
});
