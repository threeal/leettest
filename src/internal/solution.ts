import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { CompileError, RunError } from "../errors.js";
import { waitProcess } from "./utils/process.js";
import { getTool } from "./tool.js";

let llvmDirProm: Promise<string> | undefined;

const llvmUrl =
  "https://github.com/llvm/llvm-project/releases/download/llvmorg-19.1.7/LLVM-19.1.7-Linux-X64.tar.xz";

export async function testCppSolution(dir: string): Promise<void> {
  if (llvmDirProm === undefined) {
    llvmDirProm = getTool("llvm", "19.1.7", llvmUrl);
  }

  const llvmDir = await llvmDirProm;

  const testCppFile = path.join(dir, "test.cpp");
  const executableFile = path.join(dir, "build", "cpp", `test`);

  await mkdir(path.dirname(executableFile), { recursive: true });
  try {
    const proc = spawn(path.join(llvmDir, "bin", "clang++"), [
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

  try {
    const proc = spawn(executableFile);
    await waitProcess(proc);
  } catch (err) {
    throw new RunError([err], executableFile);
  }
}
