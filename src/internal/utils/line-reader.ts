import stream from "node:stream";
import readline from "node:readline";
import { Queue } from "./queue.js";

export class LineReader {
  #readline: readline.Interface;
  #linesQueue: Queue<string>;
  #readsQueue: Queue<{resolve: (value: string) => void, reject: (reason?: any) => void}>;

  constructor(input: stream.Readable) {
    this.#readline = readline.createInterface({ input });
    this.#linesQueue = new Queue();
    this.#readsQueue = new Queue();

    this.#readline.on("line", (line) => {
      const read = this.#readsQueue.pop();
      if (read !== undefined) {
        read.resolve(line);
      } else {
        this.#linesQueue.push(line);
      }
    });

    input.on("close", () => {
      let read = this.#readsQueue.pop();
      while (read !== undefined) {
        read.reject(new Error("Stream closed"));
        read = this.#readsQueue.pop();
      }
    });
  }

  async read(): Promise<string> {
    const line = this.#linesQueue.pop();
    if (line !== undefined) return line;
    if (this.#readline.
    return new Promise<string>((resolve, reject) =>
      this.#readsQueue.push({resolve, reject}),
    );
  }
}
