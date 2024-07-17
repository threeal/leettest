import {
  generateCppUtilityCode,
  cppVectorOstreamOperatorCode,
} from "./utility.js";

import "jest-extended";

it("should generate empty code for functions that return `int`", () => {
  const code = generateCppUtilityCode({
    cpp: {
      function: {
        name: "",
        arguments: [],
      },
      inputs: {},
      output: "int",
    },
    cases: [],
  });
  expect(code).toBeEmpty();
});

it("should generate ostream operator code for functions that return `std::vector<int>`", () => {
  const code = generateCppUtilityCode({
    cpp: {
      function: {
        name: "",
        arguments: [],
      },
      inputs: {},
      output: "std::vector<int>",
    },
    cases: [],
  });
  expect(code).toBe(cppVectorOstreamOperatorCode);
});
