import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppTest, getCppExecutablePath } from "./compile.js";

describe("retrieve an executable path", () => {
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
    "should retrieve an executable path on Windows platform",
    () => {
      mockPlatform("win32");
      expect(getCppExecutablePath(path.join("path", "to", "test.cpp"))).toBe(
        path.join("path", "to", "test.exe"),
      );
    },
  );

  it.concurrent(
    "should retrieve an executable path on non-Windows platform",
    () => {
      mockPlatform("non-win32");
      expect(getCppExecutablePath(path.join("path", "to", "test.cpp"))).toBe(
        path.join("path", "to", "test"),
      );
    },
  );

  afterAll(() => restorePlatform());
});

describe("compile a C++ test file", () => {
  const testDirs: ITempDirectory[] = [];
  const getTestDir = async () => {
    const testDir = await createTempDirectory();
    testDirs.push(testDir);
    return testDir;
  };

  describe("compile a valid C++ test file", () => {
    const getSourcePath = async (testDir: ITempDirectory) => {
      const sourcePath = path.join(testDir.path, "test.cpp");
      await fs.writeFile(
        sourcePath,
        [
          `#include <iostream>`,
          ``,
          `int main() {`,
          `  std::cout << "Hello world!\\n";`,
          `  return 0;`,
          `}`,
        ].join("\n"),
      );
      return sourcePath;
    };

    it.concurrent(
      "should compile a valid C++ test file",
      async () => {
        const testDir = await getTestDir();
        const sourcePath = await getSourcePath(testDir);

        const executablePath = await compileCppTest(sourcePath);

        expect(executablePath).toBe(
          getCppExecutablePath(path.join(testDir.path, "test")),
        );
        await fs.access(executablePath, fs.constants.X_OK);
      },
      60000,
    );

    it.concurrent(
      "should compile a valid C++ test file to a specified directory",
      async () => {
        const testDir = await getTestDir();
        const sourcePath = await getSourcePath(testDir);

        const executablePath = await compileCppTest(
          sourcePath,
          path.join(testDir.path, "build"),
        );

        expect(executablePath).toBe(
          getCppExecutablePath(path.join(testDir.path, "build", "test")),
        );
        await fs.access(executablePath, fs.constants.X_OK);
      },
      60000,
    );
  });

  it.concurrent(
    "should not compile an invalid C++ test file",
    async () => {
      const testDir = await getTestDir();

      const sourcePath = path.join(testDir.path, "test.cpp");
      await fs.writeFile(sourcePath, "int main() {");

      await expect(compileCppTest(sourcePath)).rejects.toThrow(
        /Command failed:[^]*1 error generated/,
      );
    },
    60000,
  );

  it.concurrent(
    "should not compile a non-existing C++ test file",
    async () => {
      const testDir = await getTestDir();
      const sourcePath = path.join(testDir.path, "test.cpp");
      await expect(compileCppTest(sourcePath)).rejects.toThrow(
        /Command failed:[^]*no such file or directory/,
      );
    },
    60000,
  );

  afterAll(async () => {
    await Promise.all(testDirs.map((testDir) => testDir.remove()));
  });
});
