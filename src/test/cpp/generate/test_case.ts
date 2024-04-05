import { Schema } from "../../schema.js";
import { formatCpp } from "./format.js";

/**
 * Generates C++ test case code from a test schema.
 *
 * @param schema - The test schema.
 * @returns The generated C++ test case code.
 */
export function generateCppTestCaseCode(schema: Schema): string {
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
