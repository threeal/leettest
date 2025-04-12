import type { ChildProcessWithoutNullStreams } from "node:child_process";
import { ProcessError } from "../errors.js";

export async function waitProcess(
  proc: ChildProcessWithoutNullStreams,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    proc.stdout.on("data", (chunk) => chunks.push(chunk));
    proc.stderr.on("data", (chunk) => chunks.push(chunk));

    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        const output = Buffer.concat(chunks).toString();
        reject(new ProcessError(proc.spawnargs, code, output));
      }
    });
  });
}
