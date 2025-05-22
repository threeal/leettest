import { Readable } from "node:stream";
import { expect, test } from "vitest";
import { StreamReader } from "./stream.js";

test("read line streams", async () => {
  const stream = new Readable({
    read: () => {
      // Do nothing.
    },
  });

  const reader = new StreamReader(stream);

  let prom = reader.readLine();
  stream.push("foo\nbar\nbaz");

  await expect(prom).resolves.toBe("foo");
  await expect(reader.readLine()).resolves.toBe("bar");

  prom = reader.readLine();
  stream.push("baz");
  setTimeout(() => stream.push("baz\nbaz"), 1000);

  await expect(prom).resolves.toBe("bazbazbaz");

  prom = reader.readLine();
  stream.destroy();

  await expect(prom).rejects.toThrow("Stream closed");
  await expect(reader.readLine()).rejects.toThrow("Stream closed");
});
