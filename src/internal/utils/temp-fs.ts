import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export interface FsTree {
  [key: string]: FsTree | string | string[];
}

let tempDirs: string[] = [];

export async function createTempFs(tree: FsTree): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "temp"));
  await createTempFsRecursively(dir, tree);
  tempDirs.push(dir);
  return dir;
}

async function createTempFsRecursively(dir: string, tree: FsTree) {
  await Promise.all(
    Object.entries(tree).map(async ([key, val]) => {
      if (typeof val === "object") {
        if (Array.isArray(val)) {
          return writeFile(path.join(dir, key), `${val.join("\n")}\n`);
        } else {
          await mkdir(path.join(dir, key));
          return createTempFsRecursively(path.join(dir, key), val);
        }
      } else {
        return writeFile(path.join(dir, key), `${val}\n`);
      }
    }),
  );
}

export async function removeAllTempFs(): Promise<void> {
  await Promise.all(
    tempDirs.map((tempDir) => rm(tempDir, { recursive: true })),
  );
  tempDirs = [];
}
