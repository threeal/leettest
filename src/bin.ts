#!/usr/bin/env node

import { program } from "commander";
import { testSolutions } from "./index.js";

program
  .name("leettest")
  .version("0.2.0")
  .description("Compile and test solutions to LeetCode problems")
  .argument("[files...]", "A list of pattern for solution files to process", [
    "**/solution.cpp",
  ])
  .action(testSolutions)
  .parse();
