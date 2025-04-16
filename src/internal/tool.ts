import { spawn } from "node:child_process";
import { access, constants, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { waitProcess } from "./utils/process.js";

export async function getTool(name: string, version: string, url: string) {
  const dir = path.join(os.homedir(), ".leettest", "tools", name, version);
  try {
    await access(dir, constants.F_OK);
  } catch {
    await rm(path.dirname(dir), { force: true, recursive: true });
    await mkdir(dir, { recursive: true });

    const curl = spawn("curl", ["-L0", url]);
    const tar = spawn("tar", ["-xJ", "--strip-components=1", "-C", dir]);

    curl.stdout.pipe(tar.stdin);

    await Promise.all([waitProcess(curl), waitProcess(tar)]);
  }
  return dir;
}
