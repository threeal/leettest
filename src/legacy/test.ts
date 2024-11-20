import { getErrorMessage } from "catched-error-message";
import ora from "ora";
import { testCppSolution } from "./test/cpp.js";

/**
 * Tests solutions to LeetCode problems.
 *
 * @param solutionFiles - An array containing the paths of the solution files to process.
 * @returns A promise that resolves to the number of failed solution files to test.
 */
export async function testSolutions(solutionFiles: string[]): Promise<number> {
  const tests = solutionFiles.map((file) => ({
    file: file,
    prom: (async () => {
      try {
        await testCppSolution(file);
      } catch (err) {
        return err;
      }
    })(),
  }));

  let failures = 0;
  const spinner = ora();
  for (const test of tests) {
    spinner.start(`Testing ${test.file}...`);
    const err = await test.prom;
    if (err) {
      ++failures;
      const msg = getErrorMessage(err).replaceAll("\n", "\n  ").trimEnd();
      spinner.fail(`Failed to test ${test.file}\n  ${msg}\n`);
    } else {
      spinner.succeed(`Tested ${test.file}`);
    }
  }

  return failures;
}
