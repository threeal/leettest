import { glob } from "glob";
import { spawn } from "node:child_process";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { waitChildProcess } from "./internal/process.js";
import { getErrorMessage } from "./internal/error.js";

export async function testSolutions(patterns: string[]): Promise<void> {
  const solutionFiles = (
    await Promise.all(patterns.map((pattern) => glob(pattern)))
  )
    .flat()
    .sort();

  await Promise.all(
    solutionFiles.map(async (solutionFile) => {
      if (path.extname(solutionFile) == ".cpp") {
        await testCppSolution(solutionFile);
      } else {
        process.stderr.write(`Unsupported file: ${solutionFile}\n`);
      }
    }),
  );
}

export async function testCppSolution(solutionFile: string): Promise<void> {
  const dir = path.dirname(solutionFile);
  const basename = path.basename(solutionFile, ".cpp");

  const testFile = path.join(dir, `${basename}_test.cpp`);
  const executableFile = path.join(dir, "build", "cpp", `${basename}_test`);

  try {
    await fsPromises.mkdir(path.dirname(executableFile), { recursive: true });
    const child = spawn("clang++", [
      "--std=c++20",
      "-O2",
      testFile,
      "-o",
      executableFile,
    ]);
    await waitChildProcess(child);
  } catch (err) {
    process.stderr.write(
      `Failed to compile ${solutionFile}: ${getErrorMessage(err)}\n`,
    );
  }

  try {
    const child = spawn(executableFile);
    await waitChildProcess(child);
  } catch (err) {
    process.stderr.write(
      `Failed to run ${executableFile}: ${getErrorMessage(err)}\n`,
    );
  }
}
