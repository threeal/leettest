import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";
import path from "node:path";
import { findExecutable, getExecutableFromSource } from "./utils.js";

describe("find an executable file", () => {
  let testDir: ITempDirectory;
  let originalPathEnv: string | undefined;

  beforeAll(async () => {
    testDir = await createTempDirectory();

    let exeFilePath = path.join(testDir.path, "some-exe");
    if (process.platform == "win32") exeFilePath += ".exe";

    await (await fs.open(exeFilePath, "w", 0o777)).close();

    originalPathEnv = process.env.PATH;
    process.env.PATH = testDir.path;
  });

  it("should find an existing executable file", async () => {
    const exeFile = await findExecutable("some-exe");
    await fs.access(exeFile, fs.constants.X_OK);
  });

  it("should find an existing executable file using an alternative name", async () => {
    const exeFile = await findExecutable("other-exe", "some-exe");
    await fs.access(exeFile, fs.constants.X_OK);
  });

  it("should not find a non-existing executable file", async () => {
    await expect(findExecutable("non-existing-exe")).rejects.toThrow(
      "not found: non-existing-exe",
    );
  });

  afterAll(async () => {
    testDir.remove();
    process.env.PATH = originalPathEnv;
  });
});

describe("retrieve an executable file path", () => {
  it("should retrieve an executable file path", () => {
    expect(getExecutableFromSource(path.join("path", "to", "main.cpp"))).toBe(
      path.join("path", "to", "main"),
    );
  });
});
