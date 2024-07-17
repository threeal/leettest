import path from "node:path";
import { compileCppSource } from "../../compile/cpp.js";
import { runExecutable } from "../../run.js";
import { readRawTestSchema } from "../schema.js";
import { generateCppTest } from "./generate/index.js";

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
  const schema = await readRawTestSchema(schemaFile);

  const testFile = path.join("build", path.dirname(solutionFile), "test.cpp");
  await generateCppTest(schema, solutionFile, testFile);

  const testExec = await compileCppSource(testFile);

  await runExecutable(testExec);
}
