import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { afterAll, expect, it } from "vitest";
import { readRawTestSchema } from "./raw.js";

const testDirs: ITempDirectory[] = [];
const getTestDir = async () => {
  const testDir = await createTempDirectory();
  testDirs.push(testDir);
  return testDir;
};

it.concurrent(
  "should read a raw test schema file",
  async () => {
    const testDir = await getTestDir();

    const schemaPath = path.join(testDir.path, "test.yaml");
    await fs.writeFile(
      schemaPath,
      [
        `cpp:`,
        `  function:`,
        `    name: sum`,
        `    arguments: [num1, num2]`,
        `  inputs:`,
        `    num1: int`,
        `    num2: int`,
        `  output: int`,
        ``,
        `cases:`,
        `  - name: example 1`,
        `    inputs:`,
        `      num1: 12`,
        `      num2: 5`,
        `    output: 17`,
        ``,
        `  - name: example 2`,
        `    inputs:`,
        `      num1: -10`,
        `      num2: 4`,
        `    output: -6`,
        ``,
      ].join("\n"),
    );

    await expect(readRawTestSchema(schemaPath)).resolves.toEqual({
      cpp: {
        function: {
          name: "sum",
          arguments: ["num1", "num2"],
        },
        inputs: {
          num1: "int",
          num2: "int",
        },
        output: "int",
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
    });
  },
  60000,
);

afterAll(async () => {
  await Promise.all(testDirs.map((testDir) => testDir.remove()));
});
