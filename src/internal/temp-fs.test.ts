import { rm, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, expect, test } from "vitest";
import { createTempFs } from "./temp-fs.js";

let tempDir: string | undefined;

function expectReadDir(...paths: string[]) {
  return expect(readdir(path.join(...paths))).resolves;
}

function expectReadFile(...paths: string[]) {
  return expect(readFile(path.join(...paths), "utf-8")).resolves;
}

test("create temporary file system", async () => {
  tempDir = await createTempFs({
    dir1: {
      dir1: {
        file1: ["line1", "line2"],
        file2: "line",
      },
      file1: "line",
    },
    dir2: {},
    file1: "",
  });

  await Promise.all([
    expectReadDir(tempDir).toStrictEqual(["dir1", "dir2", "file1"]),
    expectReadDir(tempDir, "dir1").toStrictEqual(["dir1", "file1"]),
    expectReadDir(tempDir, "dir1", "dir1").toStrictEqual(["file1", "file2"]),
    expectReadFile(tempDir, "dir1", "dir1", "file1").toBe("line1\nline2\n"),
    expectReadFile(tempDir, "dir1", "dir1", "file2").toBe("line\n"),
    expectReadFile(tempDir, "dir1", "file1").toBe("line\n"),
    expectReadDir(tempDir, "dir2").toStrictEqual([]),
    expectReadFile(tempDir, "file1").toBe("\n"),
  ]);
});

afterAll(() => tempDir && rm(tempDir, { recursive: true }));
