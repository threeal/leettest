import { access, constants, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, test, vi } from "vitest";
import { createTempFs } from "./utils/temp-fs";
import { getTool } from "./tool";

vi.mock("node:os", async (importActual) =>
  importActual<{ default: typeof os }>().then(({ default: actualOs }) => ({
    default: { ...actualOs, homedir: vi.fn() },
  })),
);

const tempDir = await createTempFs({
  ".leettest": {
    tools: {
      curl: {
        "8.12.1": {},
      },
    },
  },
});

vi.mocked(os.homedir).mockReturnValue(tempDir);

describe("retrieve example curl tools", () => {
  test("before download", async () => {
    const url =
      "https://github.com/curl/curl/releases/download/curl-8_13_0/curl-8.13.0.tar.xz";

    const curlDir = await getTool("curl", "8.13.0", url);

    expect(curlDir).toBe(
      path.join(os.homedir(), ".leettest", "tools", "curl", "8.13.0"),
    );

    expect(await readdir(path.dirname(curlDir))).toStrictEqual(["8.13.0"]);

    access(path.join(curlDir, "README"), constants.F_OK);
  });

  test("after download", async () => {
    const curlDir = await getTool("curl", "8.13.0", "");

    expect(curlDir).toBe(
      path.join(os.homedir(), ".leettest", "tools", "curl", "8.13.0"),
    );

    expect(await readdir(path.dirname(curlDir))).toStrictEqual(["8.13.0"]);

    access(path.join(curlDir, "README"), constants.F_OK);
  });
});

afterAll(() => rm(tempDir, { recursive: true }));
