import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppTest } from "./compile.js";
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

afterAll(async () => {
  await Promise.all(testDirs.map((testDir) => testDir.remove()));
});
