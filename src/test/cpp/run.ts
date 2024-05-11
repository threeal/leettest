import { exec } from "node:child_process";
import { promisify } from "node:util";

const execPromise = promisify(exec);

/**
 * Runs a C++ test executable.
 *
 * @param testExec - The path of the C++ test executable to run.
 * @returns A promise that resolves to nothing.
 */
export async function runCppTest(testExec: string): Promise<void> {
  await execPromise(testExec);
}
