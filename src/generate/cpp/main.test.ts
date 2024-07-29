import { jest } from "@jest/globals";
import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppSource } from "../../compile/cpp.js";
import { runExecutable } from "../../run.js";
import { generateCppIncludeHeadersCode } from "./headers.js";
import { generateCppMainCode } from "./main.js";

jest.retryTimes(10);

describe("test C++ main function code generation", () => {
  const testDirs: ITempDirectory[] = [];
  const getTestDir = async () => {
    const testDir = await createTempDirectory();
    testDirs.push(testDir);
    return testDir;
  };

  it.concurrent(
    "should generate a C++ main function code",
    async () => {
      const testDir = await getTestDir();

      const { code, headers } = generateCppMainCode({
        cases: [
          {
            name: "example 1",
            function: {
              name: "sum",
              arguments: ["num1", "num2"],
            },
            inputs: [
              { name: "num1", type: "int", value: 12 },
              { name: "num2", type: "int", value: 5 },
            ],
            output: { name: "output", type: "int", value: 17 },
          },
          {
            name: "example 2",
            function: {
              name: "sum",
              arguments: ["num1", "num2"],
            },
            inputs: [
              { name: "num1", type: "int", value: -10 },
              { name: "num2", type: "int", value: 4 },
            ],
            output: { name: "output", type: "int", value: -6 },
          },
        ],
      });

      const mainFile = path.join(testDir.path, "main.cpp");
      await fs.writeFile(
        mainFile,
        [
          generateCppIncludeHeadersCode(headers),
          ``,
          `class Solution {`,
          ` public:`,
          `  int sum(int num1, int num2) {`,
          `    return num1 + num2;`,
          `  }`,
          `};`,
          ``,
          code,
        ].join("\n"),
      );

      const executablePath = await compileCppSource(mainFile);

      await runExecutable(executablePath);
    },
    60000,
  );

  afterAll(async () => {
    await Promise.all(testDirs.map((testDir) => testDir.remove()));
  });
});
