import { jest } from "@jest/globals";
import path from "node:path";
import { Schema } from "../schema.js";
import "jest-extended";

jest.unstable_mockModule("../../compile/cpp.js", () => ({
  compileCppSource: jest.fn(),
}));

jest.unstable_mockModule("../../run.js", () => ({
  runExecutable: jest.fn(),
}));

jest.unstable_mockModule("../schema.js", () => ({
  readYamlSchema: jest.fn(),
}));

jest.unstable_mockModule("./generate.js", () => ({
  generateCppTest: jest.fn(),
}));

it("should test a C++ solution", async () => {
  const { compileCppSource } = await import("../../compile/cpp.js");
  const { runExecutable } = await import("../../run.js");
  const { readYamlSchema } = await import("../schema.js");
  const { generateCppTest } = await import("./generate/index.js");
  const { testCppSolution } = await import("./index.js");

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

  jest.mocked(readYamlSchema).mockResolvedValue(schema);
  jest.mocked(compileCppSource).mockImplementation(async (testFile, outDir) => {
    const outFile = testFile.replace(path.extname(testFile), "");
    return outDir !== undefined
      ? path.join(outDir, path.basename(outFile))
      : outFile;
  });

  await expect(
    testCppSolution(path.join("path", "to", "solution.cpp")),
  ).resolves.toBeUndefined();

  expect(readYamlSchema).toHaveBeenCalledExactlyOnceWith(
    path.join("path", "to", "test.yaml"),
  );

  expect(generateCppTest).toHaveBeenCalledAfter(jest.mocked(readYamlSchema));
  expect(generateCppTest).toHaveBeenCalledExactlyOnceWith(
    schema,
    path.join("path", "to", "solution.cpp"),
    path.join("build", "path", "to", "test.cpp"),
  );

  expect(compileCppSource).toHaveBeenCalledAfter(jest.mocked(generateCppTest));
  expect(compileCppSource).toHaveBeenCalledExactlyOnceWith(
    path.join("build", "path", "to", "test.cpp"),
  );

  expect(runExecutable).toHaveBeenCalledAfter(jest.mocked(compileCppSource));
  expect(runExecutable).toHaveBeenCalledExactlyOnceWith(
    path.join("build", "path", "to", "test"),
  );
});
