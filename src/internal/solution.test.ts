import { rm } from "node:fs/promises";
import path from "node:path";
import { afterAll, describe, expect, test } from "vitest";
import { CompileError, RunError } from "../errors.js";
import { testCppSolution } from "./solution.js";
import { createTempFs } from "./utils/temp-fs.js";

describe(
  "test C++ solutions",
  { concurrent: true, timeout: 30000 },
  async () => {
    const tempDir = await createTempFs({
      with_config: {
        success: {
          "test.cpp": [
          ],
          "test.yaml": [
            "examples:",
            "  1:",
            "    inputs:",
            "      num1: [1, 2, 3]",
            "      num2: [3, 4, 5]",
            "    output: true",
            "",
            "cases:",
            "  1:",
            "    inputs:",
            "      nums1: [2, 3, 4]",
            "      nums2: [4, 5, 6]",
            "    output: false",
          ],
        }
      },
      success: {
        "test.cpp": "int main() { return 0; }",
      },
      compile_error: {
        "test.cpp": "int main() {",
      },
      run_error: {
        "test.cpp": "int main() { return 1; }",
      },
    });

    test("success", () => testCppSolution(path.join(tempDir, "success")));

    test("compile error", () =>
      expect(
        testCppSolution(path.join(tempDir, "compile_error")),
      ).rejects.toThrow(CompileError));

    test("run error", () =>
      expect(testCppSolution(path.join(tempDir, "run_error"))).rejects.toThrow(
        RunError,
      ));

    afterAll(() => rm(tempDir, { recursive: true }));
  },
);
