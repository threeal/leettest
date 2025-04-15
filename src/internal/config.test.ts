import { rm } from "node:fs/promises";
import path from "node:path";
import { afterAll, describe, expect, test } from "vitest";
import { readTestConfigFile } from "./config.js";
import { createTempFs } from "./utils/temp-fs.js";

describe("read test config files", { concurrent: true }, async () => {
  const tempDir = await createTempFs({
    "success.yaml": [
      "examples:",
      "  1:",
      "    inputs:",
      "      nums1: [1, 2, 3]",
      "      nums2: [3, 4, 5]",
      "    output: true",
      "",
      "cases:",
      "  1:",
      "    inputs:",
      "      nums1: [2, 3, 4]",
      "      nums2: [4, 5, 6]",
      "    output: false",
      "",
      "  2:",
      "    inputs:",
      "      nums1: [3, 4, 5]",
      "      nums2: [5, 6, 7]",
      "    output: false",
    ],
    dir: {},
  });

  test("success", async () => {
    const testConfig = await readTestConfigFile(
      path.join(tempDir, "success.yaml"),
    );

    expect(testConfig).toStrictEqual({
      examples: {
        1: {
          inputs: {
            nums1: [1, 2, 3],
            nums2: [3, 4, 5],
          },
          output: true,
        },
      },
      cases: {
        1: {
          inputs: {
            nums1: [2, 3, 4],
            nums2: [4, 5, 6],
          },
          output: false,
        },
        2: {
          inputs: {
            nums1: [3, 4, 5],
            nums2: [5, 6, 7],
          },
          output: false,
        },
      },
    });
  });

  test("not found", async () => {
    const testConfig = await readTestConfigFile(
      path.join(tempDir, "notfound.yaml"),
    );

    expect(testConfig).toBe(null);
  });

  test("dir error", async () => {
    const prom = readTestConfigFile(path.join(tempDir, "dir"));
    await expect(prom).rejects.toThrow("EISDIR");
  });

  afterAll(() => rm(tempDir, { recursive: true }));
});
