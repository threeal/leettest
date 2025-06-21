#!/usr/bin/env node

import { program } from "commander";
import { stringifyError } from "./internal/utils/stringify.js";
import { testSolutions } from "./lib.js";

program
  .name("leettest")
  .version("0.2.0")
  .description("Compile and test solutions to LeetCode problems")
  .argument("[root]", "The root directory to search for solution files", ".")
  .action(async (root: string) => {
    for await (const { dir, err } of testSolutions(root)) {
      if (err) {
        process.stderr.write(
          `\x1b[31m✖\x1b[0m Failed to test ${dir}\n\x1b[30m${stringifyError(err, "  ")}\x1b[0m\n`,
        );
      } else {
        process.stdout.write(`\x1b[32m✔\x1b[0m Tested ${dir}\n`);
      }
    }
  })
  .parse();
