import { afterAll, describe, expect, test } from "vitest";
import { CompileError, RunError } from "../errors.js";
import { testCppSolution } from "./solution.js";
import { createTempFs, removeAllTempFs } from "../../test/temp-fs.js";

describe(
  "test C++ solutions",
  { concurrent: true, timeout: 300 * 1000 },
  async () => {
    test("success", async () => {
      const root = await createTempFs({
        "test.cpp": "int main() { return 0; }",
      });

      await testCppSolution(root.$path);
    });

    test("compile error", async () => {
      const root = await createTempFs({
        "test.cpp": "int main() {",
      });

      const prom = testCppSolution(root.$path);
      await expect(prom).rejects.toThrow(CompileError);
    });

    test("run error", async () => {
      const root = await createTempFs({
        "test.cpp": "int main() { return 1; }",
      });

      const prom = testCppSolution(root.$path);
      await expect(prom).rejects.toThrow(RunError);
    });
  },
);

afterAll(() => removeAllTempFs());
