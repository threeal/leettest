import { CppVariableSchema } from "../../../schema/cpp.js";

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
  const requiredHeaders = new Set<string>();

  const formatValue = (value: unknown, type: string): string => {
    switch (type) {
      case "std::string":
        requiredHeaders.add("string");
        return `"${value}"`;
      case "char":
        return `'${value}'`;
    }

    if (type.match(/^std::vector<.*>$/)) {
      requiredHeaders.add("vector");
      const subtype = type.substring(12, type.length - 1);
      return `{${(value as unknown[]).map((v) => formatValue(v, subtype)).join(", ")}}`;
    }

    return `${value}`;
  };

  return {
    code: `${schema.type} ${schema.name} = ${formatValue(schema.value, schema.type)};`,
    requiredHeaders,
  };
}
