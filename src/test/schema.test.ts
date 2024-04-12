import { jest } from "@jest/globals";
import "jest-extended";

jest.unstable_mockModule("node:fs", () => ({
  readFileSync: jest.fn(),
}));

it("should read a YAML schema file", async () => {
  const { readFileSync } = await import("node:fs");
  const { readYamlSchema } = await import("./schema.js");

  jest.mocked(readFileSync).mockReturnValue(`
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

  expect(readFileSync).toHaveBeenCalledExactlyOnceWith(
    "path/to/test.yaml",
    "utf-8",
  );
});
