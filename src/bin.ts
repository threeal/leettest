#!/usr/bin/env node

import { program } from "commander";
import { testSolutions } from "./index.js";

program
  .name("leettest")
  .version("0.2.0")
  .description("Compile and test solutions to LeetCode problems")
  .argument("[dir]", "The root directory to search for solution files", ".")
  .action(async (dir) => {
    const solutionFiles = await testSolutions(dir);
    for (const solutionFile of solutionFiles) {
      console.info(`Found ${solutionFile}`);
    }
  })
  .parse();
