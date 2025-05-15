import stream from "node:stream";
import { expect, test } from "vitest";
import { LineReader } from "./line-reader.js";

test("read lines", async () => {
  const input = new stream.Readable({ read: () => {} });
  const reader = new LineReader(input);

  let prom = reader.read();
  input.push("foo\nbar\nbaz");

  await expect(prom).resolves.toBe("foo");
  await expect(reader.read()).resolves.toBe("bar");

  input.push("baz\n");
  await expect(reader.read()).resolves.toBe("bazbaz");

  prom = reader.read();
  input.destroy();

  await expect(prom).rejects.toThrow("Stream closed");
  await expect(reader.read()).rejects.toThrow("Stream closed");
});
