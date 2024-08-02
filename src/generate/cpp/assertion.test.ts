import { jest } from "@jest/globals";
import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppSource } from "../../compile/cpp.js";
import { runExecutable } from "../../run.js";
import { indentCode } from "../utils.js";
import { generateCppEqualityAssertionCode } from "./assertions.js";
import { generateCppIncludeHeadersCode } from "./headers.js";

jest.retryTimes(10);

describe("generate C++ code for asserting the equality of two variables", () => {
  it.concurrent("should generate C++ code", () => {
    const { code, requiredHeaders } = generateCppEqualityAssertionCode(
      "actualVar",
      "expectedVar",
    );
    expect(code).toEqual(
      [
        `if (actualVar != expectedVar) {`,
        `  std::stringstream ss{};`,
        `  ss << "  actual: " << actualVar << "\\n";`,
        `  ss << "  expected: " << expectedVar;`,
        `  throw std::runtime_error(ss.str());`,
        `}`,
      ].join("\n"),
    );
    expect([...requiredHeaders].sort()).toEqual(["sstream", "stdexcept"]);
  });

  describe("compile and run the generated code", () => {
    const testDirs: ITempDirectory[] = [];
    const getTestDir = async () => {
      const testDir = await createTempDirectory();
      testDirs.push(testDir);
      return testDir;
    };

    const writeTestMainFile = async (
      actual: number,
      expected: number,
    ): Promise<string> => {
      const testDir = await getTestDir();
      const equalityAssertion = generateCppEqualityAssertionCode(
        "actualVar",
        "expectedVar",
      );
      const mainFile = path.join(testDir.path, "main.cpp");
      await fs.writeFile(
        mainFile,
        [
          generateCppIncludeHeadersCode(
            new Set<string>(["iostream", ...equalityAssertion.requiredHeaders]),
          ),
          ``,
          `int main() {`,
          `  int actualVar{${actual}};`,
          `  int expectedVar{${expected}};`,
          indentCode(equalityAssertion.code, "  "),
          `  return 0;`,
          `};`,
          ``,
        ].join("\n"),
      );
      return mainFile;
    };

    it.concurrent(
      "should successfully assert two equal variables",
      async () => {
        const mainFile = await writeTestMainFile(123, 123);
        const exeFile = await compileCppSource(mainFile);
        await runExecutable(exeFile);
      },
      60000,
    );

    it.concurrent(
      "should fail to assert two unequal variables",
      async () => {
        const mainFile = await writeTestMainFile(123, 234);
        const exeFile = await compileCppSource(mainFile);
        await expect(runExecutable(exeFile)).rejects.toThrow();
      },
      60000,
    );

    afterAll(async () => {
      await Promise.all(testDirs.map((testDir) => testDir.remove()));
    });
  });
});
