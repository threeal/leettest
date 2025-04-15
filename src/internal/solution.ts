import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { CompileError, ReadError, RunError } from "../errors.js";
import { waitProcess } from "./utils/process.js";
import { readTestConfigFile } from "./config.js";

export async function testCppSolution(dir: string): Promise<void> {
  const testCppFile = path.join(dir, "test.cpp");
  const executableFile = path.join(dir, "build", "cpp", `test`);

  await mkdir(path.dirname(executableFile), { recursive: true });
  try {
    const proc = spawn("clang++", [
      "--std=c++23",
      "-O2",
      testCppFile,
      "-o",
      executableFile,
    ]);
    await waitProcess(proc);
  } catch (err) {
    throw new CompileError([err], testCppFile);
  }

  const testConfigFile = path.join(dir, "test.yaml");
  const testConfig = readTestConfigFile(testConfigFile).catch((err) => {
    throw new ReadError([err], testConfigFile);
  });

  try {
    const proc = spawn(executableFile);
    await waitProcess(proc);
  } catch (err) {
    throw new RunError([err], executableFile);
  }
}
