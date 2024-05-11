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

describe("compile a C++ test file", () => {
  let sourcePath: string;
  beforeEach(async () => {
    sourcePath = path.join(testDir.path, "test.cpp");
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
  });

  it("should compile a C++ test file", async () => {
    const executablePath = await compileCppTest(sourcePath);

    expect(executablePath).toBe(path.join(testDir.path, "test"));
    await fs.access(executablePath, fs.constants.X_OK);
  }, 60000);

  it("should compile a C++ test file to a specified directory", async () => {
    const executablePath = await compileCppTest(
      sourcePath,
      path.join(testDir.path, "build"),
    );

    expect(executablePath).toBe(path.join(testDir.path, "build", "test"));
    await fs.access(executablePath, fs.constants.X_OK);
  }, 60000);
});

it("should not compile an invalid C++ test file", async () => {
  const sourcePath = path.join(testDir.path, "test.cpp");
  await fs.writeFile(sourcePath, "int main() {");

  await expect(compileCppTest(sourcePath)).rejects.toThrow(
    /Command failed:[^]*1 error generated/,
  );
}, 60000);

it("should not compile a non-existing C++ test file", async () => {
  const sourcePath = path.join(testDir.path, "test.cpp");
  await expect(compileCppTest(sourcePath)).rejects.toThrow(
    /Command failed:[^]*no such file or directory/,
  );
}, 60000);
