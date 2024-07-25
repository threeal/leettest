import { jest } from "@jest/globals";
import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppSource } from "../../../compile/cpp.js";
import { runExecutable } from "../../../run.js";
import { CppVariableSchema } from "../../schema/cpp.js";
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
      expectedOutput: /foo/,
    },
  ];

  for (const { name, schema, expectedCode, expectedOutput } of testCases) {
    describe(name, () => {
      it.concurrent("should generate C++ code", () => {
        const code = generateCppVariableDeclarationCode(schema);
        expect(code).toEqual(expectedCode);
      });

      it.concurrent(
        "should compile and run the generated C++ code",
        async () => {
          const testDir = await getTestDir();

          const mainFile = path.join(testDir.path, "main.cpp");
          await fs.writeFile(
            mainFile,
            [
              `#include <iomanip>`,
              `#include <iostream>`,
              `#include <string>`,
              ``,
              `int main() {`,
              `  ${generateCppVariableDeclarationCode(schema)}`,
              `  std::cout << std::boolalpha << ${schema.name} << "\\n";`,
              `  return 0;`,
              `};`,
              ``,
            ].join("\n"),
          );

          const exeFile = await compileCppSource(mainFile);
          const output = await runExecutable(exeFile);
          expect(output).toMatch(expectedOutput);
        },
        60000,
      );
    });
  }

  afterAll(async () => {
    await Promise.all(testDirs.map((testDir) => testDir.remove()));
  });
});
