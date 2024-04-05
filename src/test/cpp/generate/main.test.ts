import { generateCppMainCode } from "./main.js";

it("should generate a C++ main function code", () => {
  const code = generateCppMainCode({
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
      `int main() {`,
      `  int failures{0};`,
      `  for (int i{0}; i < 2; ++i) {`,
      `    std::cout << "testing " << test_cases[i].name << "...\\n";`,
      `    Solution s{};`,
      `    const int output{s.sum(test_cases[i].inputs.arg0, test_cases[i].inputs.arg1)};`,
      `    if (output != test_cases[i].output) {`,
      `      std::cerr << "failed to test " << test_cases[i].name << ":\\n";`,
      `      std::cerr << ".  output: " << output << "\\n";`,
      `      std::cerr << ".  expected: " << test_cases[i].output << "\\n\\n";`,
      `      ++failures;`,
      `    }`,
      `  }`,
      `  if (failures > 0) std::cerr << failures << " test cases have failed\\n";`,
      `  return failures;`,
      `}`,
      ``,
    ].join("\n"),
  );
});
