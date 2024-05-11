import { exec } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const execPromise = promisify(exec);

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
  let outFile = testFile.replace(path.extname(testFile), "");
  if (outDir !== undefined) {
    await mkdir(outDir, { recursive: true });
    outFile = path.join(outDir, path.basename(outFile));
  }
  await execPromise(`clang++ --std=c++20 -O2 ${testFile} -o ${outFile}`);
  return outFile;
}
