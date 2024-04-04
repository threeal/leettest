#!/usr/bin/env node

import yargs from "yargs";
import { globSync } from "glob";
import { Listr, ListrTask } from "listr2";
import { hideBin } from "yargs/helpers";
import { createTestCppSolutionTasks } from "./test/cpp.js";

yargs(hideBin(process.argv))
  .scriptName("leettest")
  .version("0.1.0")
  .command(
    "$0 [files..]",
    "Compile and test solutions to LeetCode problems",
    (yargs) =>
      yargs.positional("files", {
        describe: "A list of pattern for solution files to process",
        default: ["**/solution.cpp"],
        type: "string",
        array: true,
      }),
    async (argv) => {
      const solutionFiles = argv.files
        .map((file) => globSync(file))
        .flat()
        .sort();
      const task = new Listr(
        solutionFiles.map(
          (solutionFile): ListrTask => ({
            title: `Testing ${solutionFile}...`,
            task: (ctx, task) =>
              task.newListr(createTestCppSolutionTasks(solutionFile), {
                concurrent: false,
                exitOnError: true,
              }),
          }),
        ),
        {
          concurrent: true,
          exitOnError: false,
          collectErrors: "minimal",
          rendererOptions: {
            collapseErrors: false,
            removeEmptyLines: false,
          },
        },
      );

      await task.run();
      if (task.errors.length > 0) {
        process.exit(1);
      }
    },
  )
  .parse();
