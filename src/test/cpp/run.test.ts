import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppTest, getCppExecutablePath } from "./compile.js";
import { runCppTest } from "./run.js";

const testDirs: ITempDirectory[] = [];
const getTestDir = async () => {
  const testDir = await createTempDirectory();
  testDirs.push(testDir);
  return testDir;
};

it.concurrent(
  "should run a C++ test executable",
  async () => {
    const testDir = await getTestDir();

    const sourcePath = path.join(testDir.path, "test.cpp");
    await fs.writeFile(sourcePath, "int main() { return 0; }\n");

    const executablePath = await compileCppTest(sourcePath);

    await runCppTest(executablePath);
  },
  60000,
);

it.concurrent(
  "should run a failing C++ test executable",
  async () => {
    const testDir = await getTestDir();

    const sourcePath = path.join(testDir.path, "test.cpp");
    await fs.writeFile(
      sourcePath,
      [
        `#include <iostream>`,
        ``,
        `int main() {`,
        `  std::cerr << "unknown error\\n";`,
        `  return 1;`,
        `}`,
      ].join("\n"),
    );

    const executablePath = await compileCppTest(sourcePath);

    await expect(runCppTest(executablePath)).rejects.toThrow(
      /Command failed:[^]*unknown error/,
    );
  },
  60000,
);

it.concurrent(
  "should not run a non-existing C++ test executable",
  async () => {
    const testDir = await getTestDir();
    const executablePath = getCppExecutablePath(
      path.join(testDir.path, "test"),
    );
    await expect(runCppTest(executablePath)).rejects.toThrow(/spawn.*ENOENT/);
  },
  60000,
);

afterAll(async () => {
  await Promise.all(testDirs.map((testDir) => testDir.remove()));
});
