import { rm } from "node:fs/promises";
import path from "node:path";
import { afterAll, describe, expect, test } from "vitest";
import { readTestCasesFile } from "./cases.js";
import { createTempFs } from "./utils/temp-fs.js";

describe("read test cases files", { concurrent: true }, async () => {
  const tempDir = await createTempFs({
    "success.yaml": [
      "example_1:",
      "  inputs:",
      "    str1: foo",
      "    str2: bar",
      "  output: foobar",
      "",
      "example_2:",
      "  inputs:",
      "    str1: foo",
      "    str2: baz",
      "  output: foobaz",
    ],
    dir: {},
  });

  test("success", async () => {
    const testCases = await readTestCasesFile(
      path.join(tempDir, "success.yaml"),
    );

    expect(testCases).toStrictEqual([
      {
        name: "example_1",
        inputs: [
          { name: "str1", value: "foo" },
          { name: "str2", value: "bar" },
        ],
        output: "foobar",
      },
      {
        name: "example_2",
        inputs: [
          { name: "str1", value: "foo" },
          { name: "str2", value: "baz" },
        ],
        output: "foobaz",
      },
    ]);
  });

  test("not found", async () => {
    const testCases = await readTestCasesFile(
      path.join(tempDir, "notfound.yaml"),
    );

    expect(testCases).toStrictEqual([]);
  });

  test("dir error", async () => {
    const prom = readTestCasesFile(path.join(tempDir, "dir"));
    await expect(prom).rejects.toThrow("EISDIR");
  });

  afterAll(() => rm(tempDir, { recursive: true }));
});
