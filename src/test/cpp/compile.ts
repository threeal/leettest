import { exec } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const execPromise = promisify(exec);

/**
 * Compiles a C++ test file using Clang.
 *
 * @param testFile - The path of the C++ test file to compile.
 * @param outFile - The path of the compiled executable output.
 * @returns A promise that resolves to nothing.
 */
export async function compileCppTest(
  testFile: string,
  outFile: string,
): Promise<void> {
  await mkdir(path.dirname(outFile), { recursive: true });
  await execPromise(`clang++ --std=c++20 -O2 ${testFile} -o ${outFile}`);
}
