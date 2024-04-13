#!/usr/bin/env node

import { getErrorMessage } from "catched-error-message";
import ora from "ora";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { testCppSolution } from "./test/cpp/index.js";
import { searchSolutions } from "./search.js";

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
      const solutionFiles = searchSolutions(argv.files);

      const tests = solutionFiles.map((file) => ({
        file: file,
        prom: testCppSolution(file),
      }));

      let failures = 0;
      const spinner = ora();
      for (const test of tests) {
        spinner.start(`Testing ${test.file}...`);
        try {
          await test.prom;
          spinner.succeed(`Tested ${test.file}`);
        } catch (err) {
          ++failures;
          const msg = getErrorMessage(err).replaceAll("\n", "\n  ").trimEnd();
          spinner.fail(`Failed to test ${test.file}\n  ${msg}\n`);
        }
      }

      process.exit(failures);
    },
  )
  .parse();
