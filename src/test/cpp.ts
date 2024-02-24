import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * Compile a C++ test file using Clang.
 *
 * @param testFile - The path of the C++ test file to compile.
 * @returns A path to the compiled test executable.
 */
export function compileCppTest(testFile: string): string {
  const buildDir = path.join("build", path.dirname(testFile));
  mkdirSync(buildDir, { recursive: true });

  const testExec = path.join(buildDir, "test");
  execSync(`clang++ --std=c++20 ${testFile} -o ${testExec}`, {
    stdio: "inherit",
  });

  return testExec;
}

/**
 * Run a C++ test executable.
 *
 * @param testExec - The path of the C++ test executable to run.
 */
export function runCppTest(testExec: string): void {
  execSync(testExec, { stdio: "inherit" });
}
