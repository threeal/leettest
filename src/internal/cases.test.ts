import { afterAll, expect, test } from "vitest";
import { createTempFs, removeAllTempFs } from "./../../test/temp-fs.js";
import { readTestCasesFile } from "./cases.js";

test("read test cases file", async () => {
  const tempDir = await createTempFs({
    "cases.yaml": [
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
  });

  const testCases = await readTestCasesFile(tempDir["cases.yaml"].$path);
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

afterAll(() => removeAllTempFs());
