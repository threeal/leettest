import { jest } from "@jest/globals";
import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppSource, findCppClangExecutable } from "./cpp.js";
import { getExecutableFromSource } from "./utils.js";

jest.retryTimes(10);

const testDirs: ITempDirectory[] = [];
const getTestDir = async () => {
  const testDir = await createTempDirectory();
  testDirs.push(testDir);
  return testDir;
};

it.concurrent("should find the C++ Clang executable", async () => {
  const exeFile = await findCppClangExecutable();
  await fs.access(exeFile, fs.constants.X_OK);
});

describe("compile a C++ source file", () => {
  describe("compile a valid C++ source file", () => {
    const getSourcePath = async (testDir: ITempDirectory) => {
      const sourceFile = path.join(testDir.path, "main.cpp");
      await fs.writeFile(
        sourceFile,
        [
          `#include <iostream>`,
          ``,
          `int main() {`,
          `  std::cout << "Hello world!\\n";`,
          `  return 0;`,
          `}`,
        ].join("\n"),
      );
      return sourceFile;
    };

    it.concurrent(
      "should compile a valid C++ source file",
      async () => {
        const testDir = await getTestDir();
        const sourceFile = await getSourcePath(testDir);

        const exeFile = await compileCppSource(sourceFile);

        expect(exeFile).toBe(
          getExecutableFromSource(path.join(testDir.path, "main")),
        );
        await fs.access(exeFile, fs.constants.X_OK);
      },
      60000,
    );

    it.concurrent(
      "should compile a valid C++ source file to a specified directory",
      async () => {
        const testDir = await getTestDir();
        const sourceFile = await getSourcePath(testDir);

        const exeFile = await compileCppSource(
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
    "should not compile an invalid C++ source file",
    async () => {
      const testDir = await getTestDir();

      const sourceFile = path.join(testDir.path, "main.cpp");
      await fs.writeFile(sourceFile, "int main() {");

      await expect(compileCppSource(sourceFile)).rejects.toThrow(
        /Command failed:[^]*1 error generated/,
      );
    },
    60000,
  );

  it.concurrent(
    "should not compile a non-existing C++ source file",
    async () => {
      const testDir = await getTestDir();
      const sourceFile = path.join(testDir.path, "main.cpp");
      await expect(compileCppSource(sourceFile)).rejects.toThrow(
        /Command failed:[^]*no such file or directory/,
      );
    },
    60000,
  );
});

afterAll(async () => {
  await Promise.all(testDirs.map((testDir) => testDir.remove()));
});
