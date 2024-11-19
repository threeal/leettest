import { CppVariableSchema } from "../../schema/cpp.js";

/**
 * Generates C++ code for declaring a variable.
 *
 * @param schema - The C++ variable schema.
 * @returns An object containing the generated C++ code and the required headers.
 */
export function generateCppVariableDeclarationCode(schema: CppVariableSchema): {
  code: string;
  requiredHeaders: Set<string>;
} {
  switch (schema.type) {
    case 'boolean':
      return {
        code: `bool ${schema.name} = ${schema.value};`,
        requiredHeaders: new Set<string>(),
      };
  }

  throw new Error(`Unsupported variable type: ${schema.type}`);
}
