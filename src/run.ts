import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFilePromise = promisify(execFile);

/**
 * Runs an executable file.
 *
 * @param exeFile - The path of the executable file to run.
 * @param args - The arguments to pass to the executable file.
 * @returns A promise that resolves to the output of the executable run.
 */
export async function runExecutable(
  exeFile: string,
  args?: string[],
): Promise<string> {
  const { stdout } = await execFilePromise(exeFile, args);
  return stdout;
}
