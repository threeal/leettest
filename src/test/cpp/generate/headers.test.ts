import { jest } from "@jest/globals";
import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { compileCppSource } from "../../../compile/cpp.js";
import { runExecutable } from "../../../run.js";
import { CppHeaders } from "./headers.js";

jest.retryTimes(10);

describe("generate C++ code for including headers", () => {
  it.concurrent("should generate C++ code for including headers", () => {
    const headers = new CppHeaders(["iostream", "vector"]);
    expect(headers.generateCode()).toEqual(
      `#include <iostream>\n#include <vector>`,
    );
  });

  it.concurrent(
    "should generate C++ code for including headers after inserting a new header",
    () => {
      const headers = new CppHeaders(["iostream", "vector"]);
      headers.add("string");

      expect(headers.generateCode()).toEqual(
        `#include <iostream>\n#include <string>\n#include <vector>`,
      );
    },
  );

  describe("compile the generated C++ code for including headers", () => {
    const testDirs: ITempDirectory[] = [];
    const getTestDir = async () => {
      const testDir = await createTempDirectory();
      testDirs.push(testDir);
      return testDir;
    };

    it.concurrent(
      "should compile the generated C++ code for including headers",
      async () => {
        const testDir = await getTestDir();

        const headers = new CppHeaders(["iostream", "vector"]);

        const mainFile = path.join(testDir.path, "main.cpp");
        await fs.writeFile(
          mainFile,
          [
            headers.generateCode(),
            ``,
            `int main() {`,
            `  std::vector<int> nums{2, 3, 5, 7};`,
            `  for (const auto num : nums) {`,
            `    std::cout << num << " ";`,
            `  }`,
            `  std::cout << "\\n";`,
            `  return 0;`,
            `};`,
          ].join("\n"),
        );

        const exeFile = await compileCppSource(mainFile);
        const output = await runExecutable(exeFile);
        expect(output).toMatch(/2 3 5 7/);
      },
      60000,
    );

    afterAll(async () => {
      await Promise.all(testDirs.map((testDir) => testDir.remove()));
    });
  });
});
