import path from "node:path";
import { compileCppTest } from "./cpp/compile.js";
import { generateCppTest } from "./cpp/generate.js";
import { runCppTest } from "./cpp/run.js";
import { readYamlSchema } from "./schema.js";

/**
 * Tests the C++ solution of a LeetCode problem.
 *
 * This function will compile the C++ solution files into a test executable
 * and run the executable for testing the solution.
 *
 * @param solutionFile - The path of the C++ solution file to test.
 */
export function testCppSolution(solutionFile: string): void {
  process.stdout.write(`Testing ${solutionFile}...\n`);

  const schemaFile = path.join(path.dirname(solutionFile), "test.yaml");
  process.stdout.write(`Loading ${schemaFile}...\n`);
  const schema = readYamlSchema(schemaFile);

  const testFile = path.join("build", path.dirname(solutionFile), "test.cpp");
  process.stdout.write(`Generating ${testFile}...\n`);
  generateCppTest(schema, solutionFile, testFile);

  process.stdout.write(`Compiling ${testFile}...\n`);
  const testExec = path.join(path.dirname(testFile), "test");
  compileCppTest(testFile, testExec);

  process.stdout.write(`Running ${testExec}...\n`);
  runCppTest(testExec);
}
