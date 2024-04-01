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
      - name: num1
        type: int
      - name: num2
        type: int
    output: int

examples:
  1:
    name: example 1
    inputs:
      num1: 12
      num2: 5
    output: 17

  2:
    name: example 2
    inputs:
      num1: -10
      num2: 4
    output: -6
  `);

  const schema = readYamlSchema("path/to/test.yaml");

  expect(readFileSync).toHaveBeenCalledExactlyOnceWith(
    "path/to/test.yaml",
    "utf-8",
  );
  expect(schema).toStrictEqual({
    cpp: {
      function: {
        name: "sum",
        inputs: [
          { name: "num1", type: "int" },
          { name: "num2", type: "int" },
        ],
        output: "int",
      },
    },
    examples: {
      1: {
        name: "example 1",
        inputs: {
          num1: 12,
          num2: 5,
        },
        output: 17,
      },
      2: {
        name: "example 2",
        inputs: {
          num1: -10,
          num2: 4,
        },
        output: -6,
      },
    },
  });
});
