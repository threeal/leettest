import { afterAll, describe, expect, test } from "vitest";
import { CompileError, ReadError, RunError, TestError } from "../errors.js";
import { testCppSolution } from "./solution.js";
import { createTempFs, removeAllTempFs } from "../../test/temp-fs.js";

describe("test C++ solutions", { concurrent: true, timeout: 30000 }, () => {
  const casesYaml: string[] = [
    "example_1:",
    "  inputs:",
    "    str1: foo",
    "    str2: bar",
    "  output: foobar",
    "",
    "example_2:",
    "  inputs:",
    "    str1: foo",
    "    str2: baz",
    "  output: foobaz",
  ];

  test("success", async () => {
    const root = await createTempFs({
      "test.cpp": [
        "#include <iostream>",
        "",
        "int main() {",
        "  int n{};",
        "  std::cin >> n;",
        "  while (--n >= 0) {",
        "    std::string s1{}, s2{};",
        "    std::cin >> s1 >> s2;",
        "    std::cout << s1 + s2 << std::endl;",
        "  }",
        "  return 0;",
        "}",
      ],
      "cases.yaml": casesYaml,
    });

    await testCppSolution(root.$path);
  });

  test("compile error", async () => {
    const root = await createTempFs({
      "test.cpp": "int main() {",
    });

    const prom = testCppSolution(root.$path);
    await expect(prom).rejects.toThrow(CompileError);
  });

  test("read error", async () => {
    const root = await createTempFs({
      "test.cpp": "int main() { return 1; }",
    });

    const prom = testCppSolution(root.$path);
    await expect(prom).rejects.toThrow(ReadError);
  });

  test("run error", async () => {
    const root = await createTempFs({
      "test.cpp": "int main() { return 1; }",
      "cases.yaml": casesYaml,
    });

    const prom = testCppSolution(root.$path);
    await expect(prom).rejects.toThrow(RunError);
  });

  test("test error", async () => {
    const root = await createTempFs({
      "test.cpp": [
        "#include <iostream>",
        "",
        "int main() {",
        "  int n{};",
        "  std::cin >> n;",
        "  while (--n >= 0) {",
        "    std::string s1{}, s2{};",
        "    std::cin >> s1 >> s2;",
        "    std::cout << s1 << std::endl;",
        "  }",
        "  return 0;",
        "}",
      ],
      "cases.yaml": casesYaml,
    });

    const prom = testCppSolution(root.$path);
    await expect(prom).rejects.toThrow(TestError);
  });
});

afterAll(() => removeAllTempFs());
