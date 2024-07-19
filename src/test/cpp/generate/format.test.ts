import { jest } from "@jest/globals";
import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppSource } from "../../../compile/cpp.js";
import { runExecutable } from "../../../run.js";
import { formatCpp } from "./format.js";

jest.retryTimes(10);

describe("format values in C++ format", () => {
  const testDirs: ITempDirectory[] = [];
  const compileAndRun = async (lines: string[]): Promise<string> => {
    const testDir = await createTempDirectory();
    testDirs.push(testDir);

    const mainFile = path.join(testDir.path, "main.cpp");
    await fs.writeFile(mainFile, lines.join("\n"));

    const executablePath = await compileCppSource(mainFile);
    return await runExecutable(executablePath);
  };

  it.concurrent(
    "should format an integer in C++ format",
    async () => {
      const output = await compileAndRun([
        `#include <iostream>`,
        ``,
        `int main() {`,
        `  const int val = ${formatCpp(123, "int")};`,
        `  std::cout << val << "\\n";`,
        `  return 0;`,
        `};`,
        ``,
      ]);
      expect(output).toMatch(/123/);
    },
    60000,
  );

  it.concurrent(
    "should format a character in C++ format",
    async () => {
      const output = await compileAndRun([
        `#include <iostream>`,
        ``,
        `int main() {`,
        `  const char val = ${formatCpp("c", "char")};`,
        `  std::cout << val << "\\n";`,
        `  return 0;`,
        `};`,
        ``,
      ]);
      expect(output).toMatch(/c/);
    },
    60000,
  );

  it.concurrent(
    "should format a string in C++ format",
    async () => {
      const output = await compileAndRun([
        `#include <iostream>`,
        `#include <string>`,
        ``,
        `int main() {`,
        `  const std::string val = ${formatCpp("some string", "std::string")};`,
        `  std::cout << val << "\\n";`,
        `  return 0;`,
        `};`,
        ``,
      ]);
      expect(output).toMatch(/some string/);
    },
    60000,
  );

  it.concurrent(
    "should format an array of integers in C++ format",
    async () => {
      const output = await compileAndRun([
        `#include <iostream>`,
        `#include <vector>`,
        ``,
        `int main() {`,
        `  const std::vector<int> vals = ${formatCpp([123, 234, 345], "std::vector<int>")};`,
        `  for (const auto val : vals) {`,
        `    std::cout << val << " ";`,
        `  }`,
        `  std::cout << "\\n";`,
        `  return 0;`,
        `};`,
        ``,
      ]);
      expect(output).toMatch(/123 234 345/);
    },
    60000,
  );

  it.concurrent("should format an array of strings in C++ format", async () => {
    const output = await compileAndRun([
      `#include <iostream>`,
      `#include <string>`,
      `#include <vector>`,
      ``,
      `int main() {`,
      `  const std::vector<std::string> vals = ${formatCpp(["foo", "bar", "baz"], "std::vector<std::string>")};`,
      `  for (const auto val : vals) {`,
      `    std::cout << val << " ";`,
      `  }`,
      `  std::cout << "\\n";`,
      `  return 0;`,
      `};`,
      ``,
    ]);
    expect(output).toMatch(/foo bar baz/);
  });

  afterAll(async () => {
    await Promise.all(testDirs.map((testDir) => testDir.remove()));
  });
});
