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
      const testFiles = globSync("**/test.cpp");
      for (const testFile of testFiles) {
        process.stdout.write(`Compiling ${testFile}...\n`);
        const testExec = path.join("build", path.dirname(testFile), "test");
        compileCppTest(testFile, testExec);

        process.stdout.write(`Running ${testExec}...\n`);
        runCppTest(testExec);
      }
    },
  )
  .parse();
