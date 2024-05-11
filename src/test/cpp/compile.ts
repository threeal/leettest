import { exec } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const execPromise = promisify(exec);

/**
 * Retrieves the executable path of the given C++ source file.
 *
 * @param sourceFile - The path of the C++ source file.
 * @returns The executable path of the C++ source file.
 */
export function getCppExecutablePath(sourceFile: string): string {
  const executablePath = sourceFile.replace(path.extname(sourceFile), "");
  return process.platform === "win32"
    ? `${executablePath}.exe`
    : executablePath;
}

/**
 * Compiles a C++ test file using Clang.
 *
 * @param testFile - The path of the C++ test file to compile.
 * @param outDir - An optional path for the compiled executable output directory.
 * @returns A promise that resolves to the path of the compiled executable output.
 */
export async function compileCppTest(
  testFile: string,
  outDir?: string,
): Promise<string> {
  let outFile = getCppExecutablePath(testFile);
  if (outDir !== undefined) {
    await mkdir(outDir, { recursive: true });
    outFile = path.join(outDir, path.basename(outFile));
  }
  await execPromise(`clang++ --std=c++20 -O2 ${testFile} -o ${outFile}`);
  return outFile;
}
