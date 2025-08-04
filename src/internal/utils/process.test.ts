import { spawn } from "node:child_process";
import { describe, expect, test } from "vitest";
import { ProcessError } from "../../errors.js";
import { waitProcess } from "./process.js";

describe("wait child processes", { concurrent: true }, () => {
  test("node --version", async () => {
    const proc = spawn("node", ["--version"]);
    await waitProcess(proc);
  });

  test("node --invalid", async () => {
    const proc = spawn("node", ["--invalid"]);
    await expect(waitProcess(proc)).rejects.toThrow(ProcessError);
  });

  test("which nodee", async () => {
    const proc = spawn("which", ["nodee"]);
    await expect(waitProcess(proc)).rejects.toThrow(ProcessError);
  });
});
