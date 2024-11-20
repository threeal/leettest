import {
  generateCppUtilityCode,
  cppVectorOstreamOperatorCode,
} from "./utility.js";

import "jest-extended";

it("should generate empty code for functions that return `int`", () => {
  const code = generateCppUtilityCode({ cases: [] });
  expect(code).toBeEmpty();
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
