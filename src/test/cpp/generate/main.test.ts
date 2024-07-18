import { generateCppMainCode } from "./main.js";

it("should generate a C++ main function code", () => {
  const { code, headers } = generateCppMainCode({
    cases: [
      {
        name: "example 1",
        function: {
          name: "sum",
          arguments: ["num1", "num2"],
        },
        inputs: {
          num1: {
            type: "int",
            value: 12,
          },
          num2: {
            type: "int",
            value: 5,
          },
        },
        output: {
          type: "int",
          value: 17,
        },
      },
      {
        name: "example 2",
        function: {
          name: "sum",
          arguments: ["num1", "num2"],
        },
        inputs: {
          num1: {
            type: "int",
            value: -10,
          },
          num2: {
            type: "int",
            value: 4,
          },
        },
        output: {
          type: "int",
          value: -6,
        },
      },
    ],
  });

  expect(code).toBe(
    [
      `int main() {`,
      `  int failures{0};`,
      `  {`,
      `    std::cout << "testing example 1...\\n";`,
      `    const int output = Solution{}.sum(12, 5);`,
      `    const int expected = 17;`,
      `    if (output != expected) {`,
      `      std::cerr << "failed to test example 1:\\n";`,
      `      std::cerr << "  output: " << output << "\\n";`,
      `      std::cerr << "  expected: " << expected << "\\n\\n";`,
      `      ++failures;`,
      `    }`,
      `  }`,
      `  {`,
      `    std::cout << "testing example 2...\\n";`,
      `    const int output = Solution{}.sum(-10, 4);`,
      `    const int expected = -6;`,
      `    if (output != expected) {`,
      `      std::cerr << "failed to test example 2:\\n";`,
      `      std::cerr << "  output: " << output << "\\n";`,
      `      std::cerr << "  expected: " << expected << "\\n\\n";`,
      `      ++failures;`,
      `    }`,
      `  }`,
      `  if (failures > 0) std::cerr << failures << " test cases have failed\\n";`,
      `  return failures;`,
      `}`,
      ``,
    ].join("\n"),
  );
  expect([...headers]).toStrictEqual(["iostream"]);
});
