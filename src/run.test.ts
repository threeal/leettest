import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppTest, getCppExecutablePath } from "./test/cpp/compile.js";
import { runExecutable } from "./run.js";

const testDirs: ITempDirectory[] = [];
const getTestDir = async () => {
  const testDir = await createTempDirectory();
  testDirs.push(testDir);
  return testDir;
};

it.concurrent(
  "should run an executable file",
  async () => {
    const testDir = await getTestDir();

    const sourceFile = path.join(testDir.path, "main.cpp");
    await fs.writeFile(sourceFile, "int main() { return 0; }\n");

    const exeFile = await compileCppTest(sourceFile);

    await runExecutable(exeFile);
  },
  60000,
);

it.concurrent(
  "should run a failing executable file",
  async () => {
    const testDir = await getTestDir();

    const sourceFile = path.join(testDir.path, "main.cpp");
    await fs.writeFile(
      sourceFile,
      [
        `#include <iostream>`,
        ``,
        `int main() {`,
        `  std::cerr << "unknown error\\n";`,
        `  return 1;`,
        `}`,
      ].join("\n"),
    );

    const exeFile = await compileCppTest(sourceFile);

    await expect(runExecutable(exeFile)).rejects.toThrow(
      /Command failed:[^]*unknown error/,
    );
  },
  60000,
);

it.concurrent(
  "should not run a non-existing executable file",
  async () => {
    const testDir = await getTestDir();
    const exeFile = getCppExecutablePath(path.join(testDir.path, "main"));
    await expect(runExecutable(exeFile)).rejects.toThrow(/spawn.*ENOENT/);
  },
  60000,
);

afterAll(async () => {
  await Promise.all(testDirs.map((testDir) => testDir.remove()));
});
