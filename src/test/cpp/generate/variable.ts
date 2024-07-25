import { CppVariableSchema } from "../../schema/cpp.js";
import { formatCpp } from "./format.js";

/**
 * Generates C++ code for declaring a variable.
 *
 * @param schema - The C++ variable schema.
 * @returns The generated C++ code.
 */
export function generateCppVariableDeclarationCode(
  schema: CppVariableSchema,
): string {
  return `${schema.type} ${schema.name} = ${formatCpp(schema.value, schema.type)};`;
}
