#!/usr/bin/env node

import yargs from "yargs";
import { globSync } from "glob";
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { hideBin } from "yargs/helpers";

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

        const buildDir = path.join("build", path.dirname(testFile));
        mkdirSync(buildDir, { recursive: true });

        const testExec = path.join(buildDir, "test");
        execSync(`clang++ --std=c++20 ${testFile} -o ${testExec}`, {
          stdio: "inherit",
        });
      }
    },
  )
  .parse();
