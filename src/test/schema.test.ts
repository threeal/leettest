import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

it("should read a YAML schema file", async () => {
  const { readFile } = await import("node:fs/promises");
  const { readYamlSchema } = await import("./schema.js");

  jest.mocked(readFile).mockResolvedValue(`
cpp:
  function:
    name: sum
    inputs:
      - type: int
        value: num1
      - type: int
        value: num2
    output:
      type: int

cases:
  - name: example 1
    inputs:
      num1: 12
      num2: 5
    output: 17

  - name: example 2
    inputs:
      num1: -10
      num2: 4
    output: -6
  `);

  await expect(readYamlSchema("path/to/test.yaml")).resolves.toStrictEqual({
    cpp: {
      function: {
        name: "sum",
        inputs: [
          { type: "int", value: "num1" },
          { type: "int", value: "num2" },
        ],
        output: { type: "int" },
      },
    },
    cases: [
      {
        name: "example 1",
        inputs: {
          num1: 12,
          num2: 5,
        },
        output: 17,
      },
      {
        name: "example 2",
        inputs: {
          num1: -10,
          num2: 4,
        },
        output: -6,
      },
    ],
  });

  expect(readFile).toHaveBeenCalledExactlyOnceWith(
    "path/to/test.yaml",
    "utf-8",
  );
});
