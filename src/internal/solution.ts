import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

import {
  AssertionError,
  CompileError,
  ReadError,
  RunError,
  TestError,
} from "../errors.js";

import { readTestCasesFile } from "./cases.js";
import { waitProcess } from "./utils/process.js";
import { StreamReader } from "./utils/stream.js";

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

  const testCasesFile = path.join(dir, "cases.yaml");
  const testCases = await readTestCasesFile(testCasesFile).catch(
    (err: unknown) => {
      throw new ReadError([err], testCasesFile);
    },
  );

  const proc = spawn(executableFile);
  const assertErrs: AssertionError[] = [];
  const runResults = await Promise.allSettled([
    (async () => {
      proc.stdin.write(`${testCases.length.toString()}\n`);
      const reader = new StreamReader(proc.stdout);
      for (const { name, inputs, output: expected } of testCases) {
        for (const { value } of inputs) {
          proc.stdin.write(`${value}\n`);
        }
        const actual = await reader.readLine();
        if (actual != expected) {
          assertErrs.push(new AssertionError(name, actual, expected));
        }
      }
    })(),
    waitProcess(proc),
  ]);

  const runErrs: unknown[] = [];
  for (const result of runResults) {
    if (result.status === "rejected") {
      runErrs.push(result.reason);
    }
  }

  if (runErrs.length > 0) {
    throw new RunError(runErrs, executableFile);
  }

  if (assertErrs.length > 0) {
    throw new TestError(assertErrs, executableFile);
  }
}
