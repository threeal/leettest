import { readFile } from "node:fs/promises";
import YAML from "yaml";

export interface RawTestSchema {
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
 * Reads a raw test schema from a file.
 *
 * @param file - The path of the raw test schema file.
 * @returns A promise that resolves to the parsed raw test schema.
 */
export async function readRawTestSchema(file: string): Promise<RawTestSchema> {
  const data = await readFile(file, "utf-8");
  return YAML.parse(data);
}
