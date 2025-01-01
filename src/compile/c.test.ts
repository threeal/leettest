import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { runExecutable } from "../run.js";
import { compileCSource, findGccExecutable } from "./c.js";
import { getExecutableFromSource } from "./utils.js";

it.concurrent("should find the GCC executable", async () => {
  const exeFile = await findGccExecutable();
  await fs.access(exeFile, fs.constants.X_OK);

  const output = await runExecutable(exeFile, ["--version"]);
  expect(output).toMatch(/gcc/);
});

describe("compile a C source file", () => {
  const testDirs: ITempDirectory[] = [];
  const getTestDir = async () => {
    const testDir = await createTempDirectory();
    testDirs.push(testDir);
    return testDir;
  };

  describe("compile a valid C source file", () => {
    const getSourcePath = async (testDir: ITempDirectory) => {
      const sourceFile = path.join(testDir.path, "main.c");
      await fs.writeFile(
        sourceFile,
        [
          `#include <stdio.h>`,
          ``,
          `int main() {`,
          `  printf("Hello world!\\n");`,
          `  return 0;`,
          `}`,
        ].join("\n"),
      );
      return sourceFile;
    };

    it.concurrent(
      "should compile a valid C source file",
      async () => {
        const testDir = await getTestDir();
        const sourceFile = await getSourcePath(testDir);

        const exeFile = await compileCSource(sourceFile);

        expect(exeFile).toBe(
          getExecutableFromSource(path.join(testDir.path, "main")),
        );
        await fs.access(exeFile, fs.constants.X_OK);
      },
      60000,
    );

    it.concurrent(
      "should compile a valid C source file to a specified directory",
      async () => {
        const testDir = await getTestDir();
        const sourceFile = await getSourcePath(testDir);

        const exeFile = await compileCSource(
          sourceFile,
          path.join(testDir.path, "build"),
        );

        expect(exeFile).toBe(
          getExecutableFromSource(path.join(testDir.path, "build", "main")),
        );
        await fs.access(exeFile, fs.constants.X_OK);
      },
      60000,
    );
  });

  it.concurrent(
    "should not compile an invalid C source file",
    async () => {
      const testDir = await getTestDir();

      const sourceFile = path.join(testDir.path, "main.c");
      await fs.writeFile(sourceFile, "int main() {");

      await expect(compileCSource(sourceFile)).rejects.toThrow(
        /Command failed:[^]*expected declaration or statement at end of input/,
      );
    },
    60000,
  );

  it.concurrent(
    "should not compile a non-existing C source file",
    async () => {
      const testDir = await getTestDir();
      const sourceFile = path.join(testDir.path, "main.c");
      await expect(compileCSource(sourceFile)).rejects.toThrow(
        /Command failed:[^]*No such file or directory/,
      );
    },
    60000,
  );

  afterAll(async () => {
    await Promise.all(testDirs.map((testDir) => testDir.remove()));
  });
});
