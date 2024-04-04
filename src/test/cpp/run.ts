import { execSync } from "node:child_process";

/**
 * Runs a C++ test executable.
 *
 * @param testExec - The path of the C++ test executable to run.
 */
export function runCppTest(testExec: string): void {
  const cmd = process.platform === "win32" ? `start ${testExec}` : testExec;
  execSync(cmd, { stdio: "pipe" });
}
