import type { Readable } from "node:stream";
import { Queue } from "./queue.js";

interface ReadResolver {
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}

export class StreamReader {
  #stream: Readable;
  #buffer: string;
  #readResolverQueue: Queue<ReadResolver>;

  constructor(stream: Readable) {
    this.#stream = stream;
    this.#buffer = "";
    this.#readResolverQueue = new Queue();

    this.#stream.setEncoding("utf-8");

    this.#stream.on("data", (chunk: string) => {
      this.#buffer += chunk;

      let prevIdx = 0;
      let resolver: ReadResolver | undefined;
      while ((resolver = this.#readResolverQueue.peek()) !== undefined) {
        const idx = this.#buffer.indexOf("\n", prevIdx);
        if (idx === -1) break;

        resolver.resolve(this.#buffer.slice(prevIdx, idx));
        this.#readResolverQueue.pop();
        prevIdx = idx + 1;
      }

      this.#buffer = this.#buffer.slice(prevIdx);
    });

    this.#stream.on("close", () => {
      let resolver: ReadResolver | undefined;
      while ((resolver = this.#readResolverQueue.peek()) !== undefined) {
        resolver.reject(new Error("Stream closed"));
        this.#readResolverQueue.pop();
      }
    });
  }

  async readLine(): Promise<string> {
    if (this.#stream.closed) {
      throw new Error("Stream closed");
    }

    const idx = this.#buffer.indexOf("\n");
    if (idx !== -1) {
      const line = this.#buffer.slice(0, idx);
      this.#buffer = this.#buffer.slice(idx + 1);
      return line;
    }

    return new Promise<string>((resolve, reject) => {
      this.#readResolverQueue.push({ resolve, reject });
    });
  }
}
