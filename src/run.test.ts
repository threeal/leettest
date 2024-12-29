import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { afterAll, expect, it } from "vitest";
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
    await fs.writeFile(
      sourceFile,
      [
        `#include <iostream>`,
        ``,
        `int main() {`,
        `  std::cout << "some output\\n";`,
        `  return 0;`,
        `}`,
        ``,
      ].join("\n"),
    );

    const exeFile = await compileCppSource(sourceFile);

    const output = await runExecutable(exeFile);
    expect(output).toMatch(/some output/);
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
        `#include <iostream>`,
        ``,
        `int main(int argc, char** argv) {`,
        `  if (argc < 2) return 1;`,
        `  std::cout << argv[1];`,
        `  for (int i{2}; i < argc; ++i) {`,
        `    std::cout << " " << argv[i];`,
        `  }`,
        `  std::cout << "\\n";`,
        `  return 0;`,
        `}`,
        ``,
      ].join("\n"),
    );

    const exeFile = await compileCppSource(sourceFile);

    const output = await runExecutable(exeFile, ["foo", "bar"]);
    expect(output).toMatch(/foo bar/);
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
