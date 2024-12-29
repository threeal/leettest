import { parseCppTestSchema } from "./cpp.js";
import { expect, it } from "vitest";

it("should parse a C++ test schema from a raw test schema", () => {
  const schema = parseCppTestSchema({
    cpp: {
      function: {
        name: "sum",
        arguments: ["num1", "num2"],
      },
      inputs: {
        num1: "int",
        num2: "int",
      },
      output: "int",
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

  expect(schema).toEqual({
    cases: [
      {
        name: "example 1",
        function: {
          name: "sum",
          arguments: ["num1", "num2"],
        },
        inputs: [
          { name: "num1", type: "int", value: 12 },
          { name: "num2", type: "int", value: 5 },
        ],
        output: { name: "output", type: "int", value: 17 },
      },
      {
        name: "example 2",
        function: {
          name: "sum",
          arguments: ["num1", "num2"],
        },
        inputs: [
          { name: "num1", type: "int", value: -10 },
          { name: "num2", type: "int", value: 4 },
        ],
        output: { name: "output", type: "int", value: -6 },
      },
    ],
  });
});
