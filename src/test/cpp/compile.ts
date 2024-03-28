import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * Compiles a C++ test file using Clang.
 *
 * @param testFile - The path of the C++ test file to compile.
 * @param outFile - The path of the compiled executable output.
 */
export function compileCppTest(testFile: string, outFile: string): void {
  mkdirSync(path.dirname(outFile), { recursive: true });

  execSync(`clang++ --std=c++20 ${testFile} -o ${outFile}`);
}
