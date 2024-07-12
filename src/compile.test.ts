import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppSource, getExecutableFromSource } from "./compile.js";

describe("retrieve an executable file path from source file path", () => {
  let originalPlatform: string | undefined = undefined;

  const mockPlatform = (newPlatform: string) => {
    if (originalPlatform === undefined) originalPlatform = process.platform;
    Object.defineProperty(process, "platform", { value: newPlatform });
  };

  const restorePlatform = () => {
    if (originalPlatform === undefined) return;
    Object.defineProperty(process, "platform", { value: originalPlatform });
  };

  it.concurrent(
    "should retrieve an executable file path on Windows platform",
    () => {
      mockPlatform("win32");
      expect(getExecutableFromSource(path.join("path", "to", "main.cpp"))).toBe(
        path.join("path", "to", "main.exe"),
      );
    },
  );

  it.concurrent(
    "should retrieve an executable file path on non-Windows platform",
    () => {
      mockPlatform("non-win32");
      expect(getExecutableFromSource(path.join("path", "to", "main.cpp"))).toBe(
        path.join("path", "to", "main"),
      );
    },
  );

  afterAll(() => restorePlatform());
});

describe("compile a C++ source file", () => {
  const testDirs: ITempDirectory[] = [];
  const getTestDir = async () => {
    const testDir = await createTempDirectory();
    testDirs.push(testDir);
    return testDir;
  };

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

  afterAll(async () => {
    await Promise.all(testDirs.map((testDir) => testDir.remove()));
  });
});
