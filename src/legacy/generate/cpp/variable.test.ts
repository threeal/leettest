import { jest } from "@jest/globals";
import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppSource } from "../../../compile/cpp.js";
import { runExecutable } from "../../../run.js";
import { CppVariableSchema } from "../../schema/cpp.js";
import { generateCppIncludeHeadersCode } from "./headers.js";
import { generateCppVariableDeclarationCode } from "./variable.js";

jest.retryTimes(10);

describe("generate C++ code for declaring variables", () => {
  const testDirs: ITempDirectory[] = [];
  const getTestDir = async () => {
    const testDir = await createTempDirectory();
    testDirs.push(testDir);
    return testDir;
  };

  const testCases: {
    name: string;
    schema: CppVariableSchema;
    expectedCode: string;
    expectedRequiredHeaders?: string[];
    expectedOutput: RegExp;
  }[] = [
    {
      name: "declaring a boolean variable",
      schema: {
        name: "boolean",
        type: "bool",
        value: true,
      },
      expectedCode: `bool boolean = true;`,
      expectedOutput: /true/,
    },
    {
      name: "declaring a character variable",
      schema: {
        name: "character",
        type: "char",
        value: "A",
      },
      expectedCode: `char character = 'A';`,
      expectedOutput: /A/,
    },
    {
      name: "declaring an integer variable",
      schema: {
        name: "integer",
        type: "int",
        value: 1024,
      },
      expectedCode: `int integer = 1024;`,
      expectedOutput: /1024/,
    },
    {
      name: "declaring a floating-point variable",
      schema: {
        name: "floating",
        type: "double",
        value: 0.125,
      },
      expectedCode: `double floating = 0.125;`,
      expectedOutput: /0.125/,
    },
    {
      name: "declaring a string variable",
      schema: {
        name: "string",
        type: "std::string",
        value: "foo",
      },
      expectedCode: `std::string string = "foo";`,
      expectedRequiredHeaders: ["string"],
      expectedOutput: /foo/,
    },
    {
      name: "declaring a boolean array variable",
      schema: {
        name: "booleans",
        type: "std::vector<bool>",
        value: [true, false, 0, 1],
      },
      expectedCode: `std::vector<bool> booleans = {true, false, 0, 1};`,
      expectedRequiredHeaders: ["vector"],
      expectedOutput: /true false false true/,
    },
    {
      name: "declaring a character array variable",
      schema: {
        name: "characters",
        type: "std::vector<char>",
        value: ["A", 1],
      },
      expectedCode: `std::vector<char> characters = {'A', '1'};`,
      expectedRequiredHeaders: ["vector"],
      expectedOutput: /A 1/,
    },
    {
      name: "declaring an integer array variable",
      schema: {
        name: "integers",
        type: "std::vector<int>",
        value: [1024, -1024, 0],
      },
      expectedCode: `std::vector<int> integers = {1024, -1024, 0};`,
      expectedRequiredHeaders: ["vector"],
      expectedOutput: /1024 -1024 0/,
    },
    {
      name: "declaring a floating-point array variable",
      schema: {
        name: "floatings",
        type: "std::vector<double>",
        value: [0.125, -0.125, 0],
      },
      expectedCode: `std::vector<double> floatings = {0.125, -0.125, 0};`,
      expectedRequiredHeaders: ["vector"],
      expectedOutput: /0.125 -0.125 0/,
    },
    {
      name: "declaring a string array variable",
      schema: {
        name: "strings",
        type: "std::vector<std::string>",
        value: ["foo", "A", "", 123],
      },
      expectedCode: `std::vector<std::string> strings = {"foo", "A", "", "123"};`,
      expectedRequiredHeaders: ["string", "vector"],
      expectedOutput: /foo A {2}123/,
    },
    {
      name: "declaring a boolean matrix variable",
      schema: {
        name: "booleans",
        type: "std::vector<std::vector<bool>>",
        value: [
          [true, false],
          [0, 1],
        ],
      },
      expectedCode: `std::vector<std::vector<bool>> booleans = {{true, false}, {0, 1}};`,
      expectedRequiredHeaders: ["vector"],
      expectedOutput: /true false {2}false true/,
    },
    {
      name: "declaring a character matrix variable",
      schema: {
        name: "characters",
        type: "std::vector<std::vector<char>>",
        value: [["A"], [1]],
      },
      expectedCode: `std::vector<std::vector<char>> characters = {{'A'}, {'1'}};`,
      expectedRequiredHeaders: ["vector"],
      expectedOutput: /A {2}1/,
    },
    {
      name: "declaring an integer matrix variable",
      schema: {
        name: "integers",
        type: "std::vector<std::vector<int>>",
        value: [
          [1024, -1024],
          [0, 0],
        ],
      },
      expectedCode: `std::vector<std::vector<int>> integers = {{1024, -1024}, {0, 0}};`,
      expectedRequiredHeaders: ["vector"],
      expectedOutput: /1024 -1024 {2}0 0/,
    },
    {
      name: "declaring a floating-point matrix variable",
      schema: {
        name: "floatings",
        type: "std::vector<std::vector<double>>",
        value: [
          [0.125, -0.125],
          [0, 0],
        ],
      },
      expectedCode: `std::vector<std::vector<double>> floatings = {{0.125, -0.125}, {0, 0}};`,
      expectedRequiredHeaders: ["vector"],
      expectedOutput: /0.125 -0.125 {2}0 0/,
    },
    {
      name: "declaring a string matrix variable",
      schema: {
        name: "strings",
        type: "std::vector<std::vector<std::string>>",
        value: [
          ["foo", "A"],
          ["", 123],
        ],
      },
      expectedCode: `std::vector<std::vector<std::string>> strings = {{"foo", "A"}, {"", "123"}};`,
      expectedRequiredHeaders: ["string", "vector"],
      expectedOutput: /foo A {3}123/,
    },
  ];

  for (const tc of testCases) {
    describe(tc.name, () => {
      it.concurrent("should generate C++ code", () => {
        const { code, requiredHeaders } = generateCppVariableDeclarationCode(
          tc.schema,
        );
        expect(code).toEqual(tc.expectedCode);
        expect([...requiredHeaders].sort()).toEqual(
          tc.expectedRequiredHeaders ?? [],
        );
      });

      it.concurrent(
        "should compile and run the generated C++ code",
        async () => {
          const testDir = await getTestDir();

          const variableDeclaration = generateCppVariableDeclarationCode(
            tc.schema,
          );

          const mainFile = path.join(testDir.path, "main.cpp");
          await fs.writeFile(
            mainFile,
            [
              generateCppIncludeHeadersCode(
                new Set<string>([
                  "iomanip",
                  "iostream",
                  "vector",
                  ...variableDeclaration.requiredHeaders,
                ]),
              ),
              ``,
              `template <typename T>`,
              `std::ostream& operator<<(std::ostream& os, const std::vector<T>& vals) {`,
              `  for (const auto& val : vals) {`,
              `    os << val << " ";`,
              `  }`,
              `  return os;`,
              `}`,
              ``,
              `int main() {`,
              `  ${variableDeclaration.code}`,
              `  std::cout << std::boolalpha << ${tc.schema.name} << "\\n";`,
              `  return 0;`,
              `};`,
              ``,
            ].join("\n"),
          );

          const exeFile = await compileCppSource(mainFile);
          const output = await runExecutable(exeFile);
          expect(output).toMatch(tc.expectedOutput);
        },
        60000,
      );
    });
  }

  afterAll(async () => {
    await Promise.all(testDirs.map((testDir) => testDir.remove()));
  });
});
