import path from "node:path";
import { compileCppSource } from "../../compile/cpp.js";
import { runExecutable } from "../../run.js";
import { generateCppTest } from "../generate/cpp.js";
import { parseCppTestSchema } from "../schema/cpp.js";
import { readRawTestSchema } from "../schema/raw.js";

/**
 * Tests the C++ solution of a LeetCode problem.
 *
 * This function compiles a C++ solution file into a test executable
 * and then runs the executable for testing the solution.
 *
 * @param solutionFile - The path of the C++ solution file.
 * @returns A promise that resolves to nothing.
 */
export async function testCppSolution(solutionFile: string): Promise<void> {
  const schemaFile = path.join(path.dirname(solutionFile), "test.yaml");
  const rawSchema = await readRawTestSchema(schemaFile);
  const cppSchema = parseCppTestSchema(rawSchema);

  const testFile = path.join(path.dirname(solutionFile), "build", "test.cpp");
  await generateCppTest(cppSchema, solutionFile, testFile);

  const testExec = await compileCppSource(testFile);

  await runExecutable(testExec);
}
