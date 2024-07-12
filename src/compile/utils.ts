import path from "node:path";

/**
 * Retrieves the executable file path for the given C++ source file.
 *
 * @param sourceFile - The path of the C++ source file.
 * @returns The executable file path corresponding to the C++ source file.
 */
export function getExecutableFromSource(sourceFile: string): string {
  let executableFile = sourceFile.replace(path.extname(sourceFile), "");
  if (process.platform === "win32") executableFile += ".exe";
  return executableFile;
}
