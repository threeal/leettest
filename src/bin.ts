#!/usr/bin/env node

import yargs from "yargs";
import { globSync } from "glob";
import path from "node:path";
import { hideBin } from "yargs/helpers";
import { compileCppTest, runCppTest } from "./test/cpp.js";

yargs(hideBin(process.argv))
  .scriptName("leettest")
  .version("0.1.0")
  .command(
    "$0",
    "Compile and test solutions to LeetCode's problems",
    (yargs) => yargs,
    () => {
      const solutionFiles = globSync("**/solution.cpp");
      for (const solutionFile of solutionFiles) {
        process.stdout.write(`Testing ${solutionFile}...\n`);
        const testFile = path.join(path.dirname(solutionFile), "test.cpp");

        process.stdout.write(`Compiling ${testFile}...\n`);
        const testExec = path.join("build", path.dirname(testFile), "test");
        compileCppTest(testFile, testExec);

        process.stdout.write(`Running ${testExec}...\n`);
        runCppTest(testExec);
      }
    },
  )
  .parse();
