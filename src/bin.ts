#!/usr/bin/env node

import yargs from "yargs";
import { globSync } from "glob";
import { hideBin } from "yargs/helpers";
import { testCppSolution } from "./test/cpp.js";

yargs(hideBin(process.argv))
  .scriptName("leettest")
  .version("0.1.0")
  .command(
    "$0",
    "Compile and test solutions to LeetCode problems",
    (yargs) => yargs,
    () => {
      const solutionFiles = globSync("**/solution.cpp");
      for (const solutionFile of solutionFiles) {
        testCppSolution(solutionFile);
      }
    },
  )
  .parse();
