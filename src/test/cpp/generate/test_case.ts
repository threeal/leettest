import { formatCpp } from "./format.js";

export interface CppTestCaseSchema {
  cpp: {
    function: {
      name: string;
      inputs: {
        type: string;
        value: string;
      }[];
      output: {
        type: string;
      };
    };
  };
  cases: {
    name: string;
    inputs: { [key: string]: unknown };
    output: unknown;
  }[];
}

/**
 * Generates C++ test case code from a C++ test case schema.
 *
 * @param schema - The C++ test case schema.
 * @returns The generated C++ test case code.
 */
export function generateCppTestCaseCode(schema: CppTestCaseSchema): string {
  return [
    `struct TestCase {`,
    `  const char* name;`,
    `  struct {`,
    ...schema.cpp.function.inputs.map(
      (input, i) => `    ${input.type} arg${i};`,
    ),
    `  } inputs;`,
    `  ${schema.cpp.function.output.type} output;`,
    `};`,
    ``,
    `TestCase test_cases[${schema.cases.length}]{`,
    schema.cases
      .map((c) =>
        [
          `  {`,
          `    "${c.name}",`,
          `    .inputs{`,
          schema.cpp.function.inputs
            .map(
              (input) =>
                `      ${formatCpp(c.inputs[input.value], input.type)}`,
            )
            .join(",\n"),
          `    },`,
          `    ${formatCpp(c.output, schema.cpp.function.output.type)}`,
          `  }`,
        ].join("\n"),
      )
      .join(",\n"),
    `};`,
    ``,
  ].join("\n");
}
