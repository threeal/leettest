import { rm } from "node:fs/promises";
import path from "node:path";
import { afterAll, describe, expect, test } from "vitest";
import { CompileError } from "../errors.js";
import { testCppSolution } from "./solution.js";
import { createTempFs } from "./temp-fs.js";

describe(
  "test C++ solutions",
  { concurrent: true, timeout: 15000 },
  async () => {
    const tempDir = await createTempFs({
      success: {
        "test.cpp": "int main() { return 0; }",
      },
      compile_error: {
        "test.cpp": "int main() {",
      },
    });

    test("success", () => testCppSolution(path.join(tempDir, "success")));

    test("compile error", () =>
      expect(
        testCppSolution(path.join(tempDir, "compile_error")),
      ).rejects.toThrow(CompileError));

    afterAll(() => rm(tempDir, { recursive: true }));
  },
);
