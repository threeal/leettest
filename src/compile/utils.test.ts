import path from "node:path";
import { getExecutableFromSource } from "./utils.js";

let originalPlatform: string | undefined = undefined;

const mockPlatform = (newPlatform: string) => {
  if (originalPlatform === undefined) originalPlatform = process.platform;
  Object.defineProperty(process, "platform", { value: newPlatform });
};

const restorePlatform = () => {
  if (originalPlatform === undefined) return;
  Object.defineProperty(process, "platform", { value: originalPlatform });
};

it.concurrent(
  "should retrieve an executable file path on Windows platform",
  () => {
    mockPlatform("win32");
    expect(getExecutableFromSource(path.join("path", "to", "main.cpp"))).toBe(
      path.join("path", "to", "main.exe"),
    );
  },
);

it.concurrent(
  "should retrieve an executable file path on non-Windows platform",
  () => {
    mockPlatform("non-win32");
    expect(getExecutableFromSource(path.join("path", "to", "main.cpp"))).toBe(
      path.join("path", "to", "main"),
    );
  },
);

afterAll(() => restorePlatform());
