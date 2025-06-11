import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export interface FsContentTree {
  [key: string]: FsContentTree | string | string[];
}

export type FsTree<T> = { $path: string } & {
  [K in keyof T]: T[K] extends string | string[]
    ? { $path: string }
    : FsTree<T[K]>;
};

let tempDirs: string[] = [];

export async function createTempFs<T extends FsContentTree>(
  contentTree: T,
): Promise<FsTree<T>> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "temp"));
  tempDirs.push(tempDir);

  return createTempFsRecursively(tempDir, contentTree);
}

async function createTempFsRecursively<T extends FsContentTree>(
  parentDir: string,
  contentTree: T,
): Promise<FsTree<T>> {
  const entries = await Promise.all(
    Object.entries(contentTree).map(async ([name, content]) => {
      const $path = path.join(parentDir, name);
      if (typeof content === "object") {
        if (Array.isArray(content)) {
          await writeFile($path, `${content.join("\n")}\n`);
          return [name, { $path }];
        } else {
          await mkdir($path);
          return [name, await createTempFsRecursively($path, content)];
        }
      } else {
        await writeFile($path, `${content}\n`);
        return [name, { $path }];
      }
    }),
  );
  entries.push(["$path", parentDir]);
  return Object.fromEntries(entries) as FsTree<T>;
}

export async function removeAllTempFs(): Promise<void> {
  await Promise.all(
    tempDirs.map((tempDir) => rm(tempDir, { recursive: true })),
  );
  tempDirs = [];
}
