import { afterAll, describe, expect, test } from "vitest";
import { CompileError, RunError } from "../errors.js";
import { testCppSolution } from "./solution.js";
import { createTempFs, removeAllTempFs } from "./utils/temp-fs.js";

describe(
  "test C++ solutions",
  { concurrent: true, timeout: 30000 },
  async () => {
    test("success", async () => {
      const tempDir = await createTempFs({
        "test.cpp": "int main() { return 0; }",
      });

      await testCppSolution(tempDir);
    });

    test("compile error", async () => {
      const tempDir = await createTempFs({
        "test.cpp": "int main() {",
      });

      const prom = testCppSolution(tempDir);
      await expect(prom).rejects.toThrow(CompileError);
    });

    test("run error", async () => {
      const tempDir = await createTempFs({
        "test.cpp": "int main() { return 1; }",
      });

      const prom = testCppSolution(tempDir);
      await expect(prom).rejects.toThrow(RunError);
    });
  },
);

afterAll(() => removeAllTempFs());
