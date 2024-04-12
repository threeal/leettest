import { readFileSync } from "node:fs";
import YAML from "yaml";

export interface Schema {
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
    inputs: Record<string, unknown>;
    output: unknown;
  }[];
}

/**
 * Reads a test schema from a YAML file.
 *
 * @param schemaFile - The path of the YAML schema file.
 * @returns The parsed test schema.
 */
export function readYamlSchema(schemaFile: string): Schema {
  const data = readFileSync(schemaFile, "utf-8");
  return YAML.parse(data);
}
