import { Listr } from "listr2";
import path from "node:path";
import { compileCppTest } from "./cpp/compile.js";
import { generateCppTest } from "./cpp/generate.js";
import { runCppTest } from "./cpp/run.js";
import { readYamlSchema, Schema } from "./schema.js";

/**
 * Tests the C++ solution of a LeetCode problem.
 *
 * This function will compile the C++ solution files into a test executable
 * and run the executable for testing the solution.
 *
 * @param solutionFile - The path of the C++ solution file to test.
 */
export async function testCppSolution(solutionFile: string): Promise<void> {
  const schemaFile = path.join(path.dirname(solutionFile), "test.yaml");
  const testFile = path.join("build", path.dirname(solutionFile), "test.cpp");
  const testExec = path.join(path.dirname(testFile), "test");

  const tasks = new Listr<{ schema: Schema }>([
    {
      title: `Loading ${schemaFile}...`,
      task: (ctx): void => {
        ctx.schema = readYamlSchema(schemaFile);
      },
    },
    {
      title: `Generating ${testFile}...`,
      task: (ctx) => generateCppTest(ctx.schema, solutionFile, testFile),
    },
    {
      title: `Compiling ${testFile}...`,
      task: () => compileCppTest(testFile, testExec),
    },
    {
      title: `Running ${testExec}...`,
      task: () => runCppTest(testExec),
    },
  ]);

  await tasks.run();
}
