import { readFile } from "node:fs/promises";
import YAML from "yaml";

export interface Schema {
  cpp: {
    function: {
      name: string;
      arguments: string[];
    };
    inputs: Record<string, string>;
    output: string;
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
 * @returns A promise that resolves to the parsed test schema.
 */
export async function readYamlSchema(schemaFile: string): Promise<Schema> {
  const data = await readFile(schemaFile, "utf-8");
  return YAML.parse(data);
}
