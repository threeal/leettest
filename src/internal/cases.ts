import { readFile } from "node:fs/promises";
import * as v from "valibot";
import yaml from "yaml";

const testCasesFileSchema = v.record(
  v.string(),
  v.object({
    inputs: v.record(v.string(), v.string()),
    output: v.string(),
  }),
);

export interface TestCase {
  name: string;
  inputs: { name: string; value: string }[];
  output: string;
}

export async function readTestCasesFile(path: string): Promise<TestCase[]> {
  const content = await readFile(path, "utf-8");
  const parsedContent = v.parse(testCasesFileSchema, yaml.parse(content));
  return Object.entries(parsedContent).map(([name, { inputs, output }]) => ({
    name,
    inputs: Object.entries(inputs).map(([name, value]) => ({ name, value })),
    output,
  }));
}
