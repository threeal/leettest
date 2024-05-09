import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppTest } from "./compile.js";

let testDir: ITempDirectory;

beforeEach(async () => {
  testDir = await createTempDirectory();
});

afterEach(async () => {
  await testDir.remove();
});

it("should compile a C++ test file", async () => {
  const sourcePath = path.join(testDir.path, "test.cpp");
  await fs.writeFile(
    sourcePath,
    [
      `#include <iostream>`,
      ``,
      `int main() {`,
      `  std::cout << "Hello world!\\n";`,
      `}`,
    ].join("\n"),
  );

  const executablePath = path.join(testDir.path, "build", "test");
  await compileCppTest(sourcePath, executablePath);

  await fs.access(executablePath, fs.constants.X_OK);
});

it("should not compile an invalid C++ test file", async () => {
  const sourcePath = path.join(testDir.path, "test.cpp");
  await fs.writeFile(sourcePath, "int main() {");

  const executablePath = path.join(testDir.path, "build", "test");
  await expect(compileCppTest(sourcePath, executablePath)).rejects.toThrow(
    /Command failed:[^]*1 error generated/,
  );
});

it("should not compile a non-existing C++ test file", async () => {
  const sourcePath = path.join(testDir.path, "test.cpp");
  const executablePath = path.join(testDir.path, "build", "test");
  await expect(compileCppTest(sourcePath, executablePath)).rejects.toThrow(
    /Command failed:[^]*no such file or directory/,
  );
});
