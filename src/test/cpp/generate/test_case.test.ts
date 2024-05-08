import { generateCppTestCaseCode } from "./test_case.js";

it("should generate a C++ test case code", () => {
  const code = generateCppTestCaseCode({
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
  expect(code).toBe(
    [
      `struct {`,
      `  const char* name;`,
      `  struct {`,
      `    int arg0;`,
      `    int arg1;`,
      `  } inputs;`,
      `  int output;`,
      `} test_cases[2]{`,
      `  {`,
      `    "example 1",`,
      `    {`,
      `      12,`,
      `      5`,
      `    },`,
      `    17`,
      `  },`,
      `  {`,
      `    "example 2",`,
      `    {`,
      `      -10,`,
      `      4`,
      `    },`,
      `    -6`,
      `  }`,
      `};`,
      ``,
    ].join("\n"),
  );
});
