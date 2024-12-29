import { expect, it } from "vitest";

import {
  generateCppUtilityCode,
  cppVectorOstreamOperatorCode,
} from "./utility.js";

it("should generate empty code for functions that return `int`", () => {
  const code = generateCppUtilityCode({ cases: [] });
  expect(code).toBe("");
});

it("should generate ostream operator code for functions that return `std::vector<int>`", () => {
  const code = generateCppUtilityCode({
    cases: [
      {
        name: "",
        function: {
          name: "",
          arguments: [],
        },
        inputs: [],
        output: { name: "output", type: "std::vector<int>", value: null },
      },
    ],
  });
  expect(code).toBe(cppVectorOstreamOperatorCode);
});
