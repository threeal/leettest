import { CppVariableSchema } from "../../schema/cpp.js";

/**
 * Generates C++ code for declaring a variable.
 *
 * @param schema - The C++ variable schema.
 * @returns The generated C++ code.
 */
export function generateCppVariableDeclarationCode(
  schema: CppVariableSchema,
): string {
  function formatValue(value: unknown, type: string): string {
    switch (type) {
      case "std::string":
        return `"${value}"`;
      case "char":
        return `'${value}'`;
    }

    if (type.match(/^std::vector<.*>$/)) {
      const subtype = type.substring(12, type.length - 1);
      return `{${(value as unknown[]).map((v) => formatValue(v, subtype)).join(", ")}}`;
    }

    return `${value}`;
  }

  return `${schema.type} ${schema.name} = ${formatValue(schema.value, schema.type)};`;
}
