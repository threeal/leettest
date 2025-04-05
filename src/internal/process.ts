import type { ChildProcessWithoutNullStreams } from "node:child_process";

export async function waitChildProcess(
  child: ChildProcessWithoutNullStreams,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const errChunks: Uint8Array[] = [];
    child.stderr.on("data", (chunk) => errChunks.push(chunk));

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        const command = child.spawnargs.join(" ");
        const output = Buffer.concat(errChunks).toString();
        reject(new Error(`Process failed: ${command}\n${output}`));
      }
    });
  });
}
