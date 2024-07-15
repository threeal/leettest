import fs from "node:fs/promises";
import { findGccExecutable } from "./c.js";

it.concurrent("should find the GCC executable", async () => {
  const exeFile = await findGccExecutable();
  await fs.access(exeFile, fs.constants.X_OK);
});
