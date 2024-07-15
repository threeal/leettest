import path from "node:path";
import which from "which";

/**
 * Finds the path of an executable file with the given name.
 *
 * @param name - The name of the executable file to find.
 * @param alternativeNames - List of alternative names for the executable file.
 * @returns A promise that resolves to the path of the executable file.
 */
export async function findExecutable(
  name: string,
  ...alternativeNames: string[]
): Promise<string> {
  const names = [name, ...alternativeNames];

  for (const name of names) {
    const exeFile = await which(name, { nothrow: true });
    if (exeFile !== null) return exeFile;
  }

  throw new Error(`not found: ${names.join(", ")}`);
}

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
