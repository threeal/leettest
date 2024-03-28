import { Listr } from "listr2";
import path from "node:path";
import { compileCppTest } from "./cpp/compile.js";
import { generateCppTest } from "./cpp/generate.js";
import { runCppTest } from "./cpp/run.js";
import { readYamlSchema, Schema } from "./schema.js";

/**
 * Creates a task for testing the C++ solution of a LeetCode problem.
 *
 * This function will create a listr2 task for compiling a C++ solution file into a test executable
 * and then run the executable for testing the solution.
 *
 * @param solutionFile - The path of the C++ solution file.
 * @returns a listr2 task.
 */
export function createTestCppSolutionTask(solutionFile: string): Listr {
  const schemaFile = path.join(path.dirname(solutionFile), "test.yaml");
  const testFile = path.join("build", path.dirname(solutionFile), "test.cpp");
  const testExec = path.join(path.dirname(testFile), "test");

  return new Listr<{ schema: Schema }>([
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
}
