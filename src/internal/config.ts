import { readFile } from "node:fs/promises";
import * as v from "valibot";
import yaml from "yaml";

type Type = boolean | number | string | Type[];

const typeSchema: v.GenericSchema<Type> = v.lazy(() =>
  v.union([v.boolean(), v.number(), v.string(), v.array(typeSchema)]),
);

const testCaseSchema = v.object({
  inputs: v.record(v.string(), typeSchema),
  output: typeSchema,
});

const testConfigSchema = v.object({
  examples: v.optional(v.record(v.string(), testCaseSchema)),
  cases: v.optional(v.record(v.string(), testCaseSchema)),
});

export type TestConfig = v.InferOutput<typeof testConfigSchema>;

async function safeReadFile(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf-8");
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

export async function readTestConfigFile(
  path: string,
): Promise<TestConfig | null> {
  const rawContent = await safeReadFile(path);
  if (rawContent === null) return null;
  return v.parse(testConfigSchema, yaml.parse(rawContent));
}
