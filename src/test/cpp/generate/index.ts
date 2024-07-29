import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CppTestSchema } from "../../../schema/cpp.js";
import { generateCppIncludeHeadersCode } from "./headers.js";
import { generateCppMainCode } from "./main.js";
import { generateCppUtilityCode } from "./utility.js";

/**
 * Generates a C++ test file from a test schema.
 *
 * @param schema - The C++ test schema.
 * @param solutionFile - The path of the C++ solution file.
 * @param outFile - The path of the C++ test file output.
 * @returns A promise that resolves to nothing.
 */
export async function generateCppTest(
  schema: CppTestSchema,
  solutionFile: string,
  outFile: string,
): Promise<void> {
  const main = generateCppMainCode(schema);

  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(
    outFile,
    [
      `#include "${path.relative(path.dirname(outFile), solutionFile)}"`,
      ``,
      generateCppIncludeHeadersCode(main.headers),
      ``,
      generateCppUtilityCode(schema),
      main.code,
    ].join("\n"),
  );
}
