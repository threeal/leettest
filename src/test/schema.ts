import { readFileSync } from "node:fs";
import YAML from "yaml";

/**
 * Reads a test schema from a YAML file.
 *
 * @param schemaFile - The path of the YAML schema file.
 * @returns The parsed test schema.
 */
export function readYamlSchema(schemaFile: string) {
  const data = readFileSync(schemaFile, "utf-8");
  return YAML.parse(data);
}
