import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFilePromise = promisify(execFile);

/**
 * Runs an executable file.
 *
 * @param exeFile - The path of the executable file to run.
 * @returns A promise that resolves when the executable file has finished running.
 */
export async function runExecutable(exeFile: string): Promise<void> {
  await execFilePromise(exeFile);
}
