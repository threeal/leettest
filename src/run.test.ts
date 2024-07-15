import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppSource } from "./compile/cpp.js";
import { getExecutableFromSource } from "./compile/utils.js";
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

    const exeFile = await compileCppSource(sourceFile);

    await runExecutable(exeFile);
  },
  60000,
);

it.concurrent(
  "should run an executable file with arguments",
  async () => {
    const testDir = await getTestDir();

    const sourceFile = path.join(testDir.path, "main.cpp");
    await fs.writeFile(
      sourceFile,
      [
        `#include <cassert>`,
        `#include <cstring>`,
        ``,
        `int main(int argc, char** argv) {`,
        `  assert(argc == 3);`,
        `  assert(strcmp(argv[1], "foo") == 0);`,
        `  assert(strcmp(argv[2], "bar") == 0);`,
        `  return 0;`,
        `}`,
        ``,
      ].join("\n"),
    );

    const exeFile = await compileCppSource(sourceFile);

    await runExecutable(exeFile, ["foo", "bar"]);
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

    const exeFile = await compileCppSource(sourceFile);

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
    const exeFile = getExecutableFromSource(path.join(testDir.path, "main"));
    await expect(runExecutable(exeFile)).rejects.toThrow(/spawn.*ENOENT/);
  },
  60000,
);

afterAll(async () => {
  await Promise.all(testDirs.map((testDir) => testDir.remove()));
});
