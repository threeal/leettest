#!/usr/bin/env node

import yargs from "yargs";
import { globSync } from "glob";
import { hideBin } from "yargs/helpers";
import { testCppSolution } from "./test/cpp/index.js";

yargs(hideBin(process.argv))
  .scriptName("leettest")
  .version("0.2.0")
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

      const tests = solutionFiles.map((file) => ({
        file: file,
        prom: (async () => testCppSolution(file))(),
      }));

      let failures = 0;
      for (const test of tests) {
        try {
          await test.prom;
          process.stdout.write(`✔ Tested ${test.file}\n`);
        } catch (err) {
          ++failures;
          process.stdout.write(`✖ Failed to test ${test.file}\n`);
          process.stdout.write(`${err instanceof Error ? err.message : err}\n`);
        }
      }

      process.exit(failures);
    },
  )
  .parse();
