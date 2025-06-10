import { expect, test, vi } from "vitest";
import * as solutionModule from "./solution.js";

interface Output {
  type: "stdout" | "stderr";
  buffer: string | Uint8Array;
}

test("run executable", async () => {
  const output: Output[] = [];

  vi.spyOn(process.stdout, "write").mockImplementation((buffer) => {
    output.push({ type: "stdout", buffer });
    return true;
  });

  vi.spyOn(process.stderr, "write").mockImplementation((buffer) => {
    output.push({ type: "stderr", buffer });
    return true;
  });

  vi.spyOn(solutionModule, "testSolutions").mockImplementation(
    async function* () {
      yield { dir: "foo", err: undefined };
      yield { dir: "bar", err: new Error("something happened") };
    },
  );

  process.argv = ["node", "bin.js"];
  await import("./bin.js");

  expect(output).toStrictEqual([
    { type: "stdout", buffer: "\x1b[32m✔\x1b[0m Tested foo\n" },
    {
      type: "stderr",
      buffer:
        "\x1b[31m✖\x1b[0m Failed to test bar\n\x1b[30m  something happened\x1b[0m\n",
    },
  ]);
});
