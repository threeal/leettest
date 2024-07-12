import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";
import { getExecutableFromSource } from "./utils.js";

const execFilePromise = promisify(execFile);

/**
 * Compiles a C++ source file using Clang.
 *
 * @param sourceFile - The path of the C++ source file to compile.
 * @param outDir - An optional output directory for the compiled executable file.
 * @returns A promise that resolves to the path of the compiled executable file.
 */
export async function compileCppSource(
  sourceFile: string,
  outDir?: string,
): Promise<string> {
  let exeFile = getExecutableFromSource(sourceFile);
  if (outDir !== undefined) {
    await mkdir(outDir, { recursive: true });
    exeFile = path.join(outDir, path.basename(exeFile));
  }
  await execFilePromise("clang++", [
    "--std=c++20",
    "-O2",
    sourceFile,
    "-o",
    exeFile,
  ]);
  return exeFile;
}
