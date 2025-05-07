import stream from "node:stream";
import readline from "node:readline";
import { Queue } from "./queue.js";

export class LineReader {
  #readline: readline.Interface;
  #linesQueue: Queue<string>;
  #readResolversQueue: Queue<(value: string) => void>;

  constructor(input: stream.Readable) {
    this.#readline = readline.createInterface({ input });
    this.#linesQueue = new Queue();
    this.#readResolversQueue = new Queue();

    this.#readline.on("line", (line) => {
      const readResolver = this.#readResolversQueue.pop();
      if (readResolver !== undefined) {
        readResolver(line);
      } else {
        this.#linesQueue.push(line);
      }
    });
  }

  async read(): Promise<string> {
    const line = this.#linesQueue.pop();
    if (line !== undefined) return line;
    return new Promise<string>((resolve) =>
      this.#readResolversQueue.push(resolve),
    );
  }
}
