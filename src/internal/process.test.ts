import { spawn } from "node:child_process";
import { describe, expect, it } from "vitest";
import { waitChildProcess } from "./process.js";

describe("wait child processes", { concurrent: true }, () => {
  it("should wait a successful process", async () => {
    const proc = spawn("node", ["--version"]);
    await waitChildProcess(proc);
  });

  it("should wait a failing process", async () => {
    const proc = spawn("node", ["--invalid"]);
    await expect(waitChildProcess(proc)).rejects.toThrow(
      /bad option: --invalid/,
    );
  });
});
