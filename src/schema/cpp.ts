import { RawTestSchema } from "./raw.js";

export interface CppVariableSchema {
  name: string;
  type: string;
  value: unknown;
}

export interface CppTestSchema {
  cases: {
    name: string;
    function: {
      name: string;
      arguments: string[];
    };
    inputs: CppVariableSchema[];
    output: CppVariableSchema;
  }[];
}

/**
 * Parses a C++ test schema from a raw test schema.
 *
 * @param rawSchema - The raw test schema to parse.
 * @returns A parsed C++ test schema.
 */
export function parseCppTestSchema(rawSchema: RawTestSchema): CppTestSchema {
  return {
    cases: rawSchema.cases.map(({ name, inputs, output }) => {
      return {
        name,
        function: rawSchema.cpp.function,
        inputs: Object.entries(inputs).map(([name, value]) => ({
          name,
          type: rawSchema.cpp.inputs[name],
          value,
        })),
        output: {
          name: "output",
          type: rawSchema.cpp.output,
          value: output,
        },
      };
    }),
  };
}
