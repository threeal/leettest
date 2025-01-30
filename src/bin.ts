#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { testSolutions } from "./index.js";

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
      const solutionFiles = await testSolutions(argv.files);
      for (const solutionFile of solutionFiles) {
        console.info(`Found ${solutionFile}`);
      }
    },
  )
  .parse();
