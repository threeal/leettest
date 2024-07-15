import { mkdir } from "node:fs/promises";
import path from "node:path";
import { runExecutable } from "../run.js";
import { findExecutable, getExecutableFromSource } from "./utils.js";

/**
 * Finds the GCC executable file.
 *
 * @returns A promise that resolves to the path of the GCC executable file.
 */
export async function findGccExecutable(): Promise<string> {
  return await findExecutable("gcc-13", "gcc");
}

/**
 * Compiles a C source file using GCC.
 *
 * @param sourceFile - The path of the C source file to compile.
 * @param outDir - An optional output directory for the compiled executable file.
 * @returns A promise that resolves to the path of the compiled executable file.
 */
export async function compileCSource(
  sourceFile: string,
  outDir?: string,
): Promise<string> {
  const gccExeFile = await findGccExecutable();
  let exeFile = getExecutableFromSource(sourceFile);
  if (outDir !== undefined) {
    await mkdir(outDir, { recursive: true });
    exeFile = path.join(outDir, path.basename(exeFile));
  }
  await runExecutable(gccExeFile, ["-O2", sourceFile, "-o", exeFile]);
  return exeFile;
}
