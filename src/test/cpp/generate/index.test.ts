import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { Schema } from "../../schema.js";
import { compileCppTest } from "./../compile.js";
import { runCppTest } from "./../run.js";
import { generateCppTest } from "./index.js";

const testDirs: ITempDirectory[] = [];
const getTestDir = async () => {
  const testDir = await createTempDirectory();
  testDirs.push(testDir);
  return testDir;
};

it.concurrent(
  "should generate a C++ test file",
  async () => {
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
          inputs: { num1: 12, num2: 5 },
          output: 17,
        },
        {
          name: "example 2",
          inputs: { num1: -10, num2: 4 },
          output: -6,
        },
      ],
    };

    const testDir = await getTestDir();

    const solutionSourcePath = path.join(testDir.path, "solution.cpp");
    await fs.writeFile(
      solutionSourcePath,
      [
        `class Solution {`,
        ` public:`,
        `  int sum(int num1, int num2) {`,
        `    return num1 + num2;`,
        `  }`,
        `};`,
      ].join("\n"),
    );

    const testSourcePath = path.join(testDir.path, "test.cpp");
    await generateCppTest(schema, solutionSourcePath, testSourcePath);

    const executablePath = await compileCppTest(testSourcePath);

    await runCppTest(executablePath);
  },
  60000,
);

afterAll(async () => {
  await Promise.all(testDirs.map((testDir) => testDir.remove()));
});
