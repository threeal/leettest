import { findExecutable } from "./utils.js";

/**
 * Finds the GCC executable file.
 *
 * @returns A promise that resolves to the path of the GCC executable file.
 */
export async function findGccExecutable(): Promise<string> {
  return await findExecutable("gcc-13", "gcc");
}
