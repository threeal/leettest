import { mkdir } from "node:fs/promises";
import path from "node:path";
import { runExecutable } from "../run.js";
import { findExecutable, getExecutableFromSource } from "./utils.js";

/**
 * Finds the C++ Clang executable file.
 *
 * @returns A promise that resolves to the path of the C++ Clang executable file.
 */
export async function findCppClangExecutable(): Promise<string> {
  return await findExecutable("clang++");
}

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
  const cppClangExeFile = await findCppClangExecutable();
  let exeFile = getExecutableFromSource(sourceFile);
  if (outDir !== undefined) {
    await mkdir(outDir, { recursive: true });
    exeFile = path.join(outDir, path.basename(exeFile));
  }
  await runExecutable(cppClangExeFile, [
    "--std=c++20",
    "-O2",
    sourceFile,
    "-o",
    exeFile,
  ]);
  return exeFile;
}
