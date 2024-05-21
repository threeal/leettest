import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppTest } from "../compile.js";
import { runCppTest } from "../run.js";
import { formatCpp } from "./format.js";

const testDirs: ITempDirectory[] = [];
const compileAndRun = async (lines: string[]) => {
  const testDir = await createTempDirectory();
  testDirs.push(testDir);

  const sourcePath = path.join(testDir.path, "main.cpp");
  await fs.writeFile(sourcePath, lines.join("\n"));

  const executablePath = await compileCppTest(sourcePath);
  await runCppTest(executablePath);
}

describe("format values in C++ format", () => {
  it.concurrent("should format an integer in C++ format", async () => {
    await compileAndRun([
      `#include <cassert>`,
      ``,
      `int main() {`,
      `  int val = ${formatCpp(123, "int")};`,
      `  assert(val == 123);`,
      `};`,
      ``
    ]);
  }, 60000);

  it.concurrent("should format a character in C++ format", async () => {
    await compileAndRun([
      `#include <cassert>`,
      ``,
      `int main() {`,
      `  char val = ${formatCpp("c", "char")};`,
      `  assert(val == 'c');`,
      `};`,
      ``
    ]);
  }, 60000);

  it.concurrent("should format a string in C++ format", async () => {
    await compileAndRun([
      `#include <cassert>`,
      `#include <string>`,
      ``,
      `int main() {`,
      `  std::string val = ${formatCpp("something", "std::string")};`,
      `  assert(val == "something");`,
      `};`,
      ``
    ]);
  }, 60000);

  it("should format an array of integers", () => {
    expect(formatCpp([123, 234, 345], "std::vector<int>")).toBe(
      "{123, 234, 345}",
    );
  });

  it("should format an array of strings", () => {
    expect(formatCpp(["foo", "bar", "baz"], "std::vector<std::string>")).toBe(
      `{"foo", "bar", "baz"}`,
    );
  });
});

afterAll(async () => {
  await Promise.all(testDirs.map((testDir) => testDir.remove()));
});
