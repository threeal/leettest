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
        inputs: [],
        output: { type: "int" },
      },
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
        inputs: [],
        output: { type: "std::vector<int>" },
      },
    },
    cases: [],
  });
  expect(code).toBe(cppVectorOstreamOperatorCode);
});
