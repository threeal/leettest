import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";
import { findGccExecutable } from "./c.js";

const execFilePromise = promisify(execFile);

it.concurrent("should find the GCC executable", async () => {
  const exeFile = await findGccExecutable();
  await fs.access(exeFile, fs.constants.X_OK);

  const { stdout } = await execFilePromise(exeFile, ["--version"]);
  expect(stdout).toMatch("gcc");
});
