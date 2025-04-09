#!/usr/bin/env node

import { program } from "commander";
import { testSolutions } from "./solution.js";

program
  .name("leettest")
  .version("0.2.0")
  .description("Compile and test solutions to LeetCode problems")
  .argument("[root]", "The root directory to search for solution files", ".")
  .action(async (root) => {
    for await (const { dir, err } of testSolutions(root)) {
      if (err == null) {
        console.info(`Tested ${dir}`);
      } else {
        console.error(`Failed to test ${dir}:`, err);
      }
    }
  })
  .parse();
