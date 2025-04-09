import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { CompileError } from "../errors.js";
import { waitProcess } from "./process.js";

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
}
