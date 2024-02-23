#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .scriptName("leetsolve")
  .version("0.1.0")
  .command(
    "$0",
    "Compile and test solutions to LeetCode's problems",
    (yargs) => yargs,
    () => {
      // TODO
    },
  )
  .parse();
