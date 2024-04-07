import { ListrTask } from "listr2";
import path from "node:path";
import { readYamlSchema, Schema } from "../schema.js";
import { generateCppTest } from "./generate/index.js";
import { compileCppTest } from "./compile.js";
import { runCppTest } from "./run.js";

/**
 * Creates a list of tasks for testing the C++ solution of a LeetCode problem.
 *
 * This function creates a list of Listr tasks for compiling a C++ solution file into a test executable
 * and then running the executable for testing the solution.
 *
 * @param solutionFile - The path of the C++ solution file.
 * @returns A list of Listr tasks.
 */
export function createTestCppSolutionTasks(solutionFile: string): ListrTask[] {
  const schemaFile = path.join(path.dirname(solutionFile), "test.yaml");
  const testFile = path.join("build", path.dirname(solutionFile), "test.cpp");
  const testExec = path.join(path.dirname(testFile), "test");

  return [
    {
      title: `Loading ${schemaFile}...`,
      task: (ctx: { schema: Schema }): void => {
        ctx.schema = readYamlSchema(schemaFile);
      },
    },
    {
      title: `Generating ${testFile}...`,
      task: (ctx: { schema: Schema }): void =>
        generateCppTest(ctx.schema, solutionFile, testFile),
    },
    {
      title: `Compiling ${testFile}...`,
      task: (): void => compileCppTest(testFile, testExec),
    },
    {
      title: `Running ${testExec}...`,
      task: (): void => runCppTest(testExec),
    },
  ];
}
