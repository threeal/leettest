import path from "node:path";
import { readYamlSchema } from "../schema.js";
import { generateCppTest } from "./generate/index.js";
import { compileCppTest } from "./compile.js";
import { runCppTest } from "./run.js";

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
  const schema = await readYamlSchema(schemaFile);

  const testFile = path.join("build", path.dirname(solutionFile), "test.cpp");
  await generateCppTest(schema, solutionFile, testFile);

  const testExec = path.join(path.dirname(testFile), "test");
  await compileCppTest(testFile, testExec);

  await runCppTest(testExec);
}
