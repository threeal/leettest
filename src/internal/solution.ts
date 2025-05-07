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
import { waitProcess } from "./utils/process.js";
import { readTestCasesFile } from "./cases.js";
import { LineReader } from "./utils/line-reader.js";

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
  const testCases = await readTestCasesFile(testCasesFile).catch((err) => {
    throw new ReadError([err], testCasesFile);
  });

  const testErrors: TestError[] = [];
  try {
    const proc = spawn(executableFile);

    const lineReader = new LineReader(proc.stdout);
    for (const { name, inputs, output: expected } of testCases) {
      for (const input of Object.values(inputs)) {
        proc.stdin.write(`${input}\n`);
      }
      const actual = await lineReader.read();
      if (actual != expected) {
        testErrors.push(
          new TestError([new AssertionError(actual, expected)], name),
        );
      }
    }

    await waitProcess(proc);
  } catch (err) {
    throw new RunError([err], executableFile);
  }

  if (testErrors.length > 0) {
    throw new TestError(testErrors, dir);
  }
}
