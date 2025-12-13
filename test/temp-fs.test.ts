import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, expect, test } from "vitest";
import { createTempFs, removeAllTempFs } from "./temp-fs.js";

function expectReadDir(dir: string) {
  return expect(readdir(dir)).resolves;
}

function expectReadFile(file: string) {
  return expect(readFile(file, "utf-8")).resolves;
}

test("create temporary file system", { concurrent: true }, async () => {
  const { $path, ...root } = await createTempFs({
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

  expect($path).toBeTypeOf("string");
  expect(root).toStrictEqual({
    dir1: {
      $path: path.join($path, "dir1"),
      dir1: {
        $path: path.join(root.dir1.$path, "dir1"),
        file1: { $path: path.join(root.dir1.dir1.$path, "file1") },
        file2: { $path: path.join(root.dir1.dir1.$path, "file2") },
      },
      file1: { $path: path.join(root.dir1.$path, "file1") },
    },
    dir2: { $path: path.join($path, "dir2") },
    file1: { $path: path.join($path, "file1") },
  });

  await Promise.all([
    expectReadDir($path).toStrictEqual(["dir1", "dir2", "file1"]),
    expectReadDir(root.dir1.$path).toStrictEqual(["dir1", "file1"]),
    expectReadDir(root.dir1.dir1.$path).toStrictEqual(["file1", "file2"]),
    expectReadFile(root.dir1.dir1.file1.$path).toBe("line1\nline2\n"),
    expectReadFile(root.dir1.dir1.file2.$path).toBe("line\n"),
    expectReadFile(root.dir1.file1.$path).toBe("line\n"),
    expectReadDir(root.dir2.$path).toStrictEqual([]),
    expectReadFile(root.file1.$path).toBe("\n"),
  ]);
});

test("remove all temporary file system", { concurrent: true }, async () => {
  const roots = await Promise.all([createTempFs({}), createTempFs({})]);

  await Promise.all(
    roots.map((tempFs) =>
      expect(access(tempFs.$path)).resolves.toBeUndefined(),
    ),
  );

  await removeAllTempFs();

  await Promise.all(
    roots.map((tempFs) => expect(access(tempFs.$path)).rejects.toThrow()),
  );
});

afterAll(() => removeAllTempFs());
