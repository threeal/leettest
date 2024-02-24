#!/usr/bin/env node

import yargs from "yargs";
import { globSync } from "glob";
import { execSync } from "node:child_process";
import { hideBin } from "yargs/helpers";
import { compileCppTest } from "./test/index.js";

yargs(hideBin(process.argv))
  .scriptName("leetsolve")
  .version("0.1.0")
  .command(
    "$0",
    "Compile and test solutions to LeetCode's problems",
    (yargs) => yargs,
    () => {
      const testFiles = globSync("**/test.cpp");
      for (const testFile of testFiles) {
        process.stdout.write(`Compiling ${testFile}...\n`);
        const testExec = compileCppTest(testFile);

        process.stdout.write(`Running ${testExec}...\n`);
        execSync(testExec, { stdio: "inherit" });
      }
    },
  )
  .parse();
