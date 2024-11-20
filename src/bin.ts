#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { testSolutions } from "./legacy/test.js";
import { searchSolutions } from "./search.js";

yargs(hideBin(process.argv))
  .scriptName("leettest")
  .version("0.2.0")
  .command(
    "$0 [files..]",
    "Compile and test solutions to LeetCode problems",
    (yargs) =>
      yargs
        .positional("files", {
          describe: "A list of pattern for solution files to process",
          default: ["**/solution.cpp"],
          type: "string",
          array: true,
        })
        .option("legacy", {
          describe: "Use the legacy behavior",
        }),
    async (argv) => {
      const solutionFiles = searchSolutions(argv.files);
      if (argv.legacy) {
        const failures = await testSolutions(solutionFiles);
        process.exit(failures);
      } else {
        console.log(solutionFiles);
      }
    },
  )
  .parse();
