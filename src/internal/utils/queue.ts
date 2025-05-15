export class Queue<T> {
  #items: T[];
  #offset: number;

  constructor() {
    this.#items = [];
    this.#offset = 0;
  }

  push(item: T) {
    this.#items.push(item);
  }

  pop(): T | undefined {
    if (this.isEmpty()) return undefined;

    const item = this.#items[this.#offset++];

    // Clean up to prevent memory leak.
    if (this.#offset * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#offset);
      this.#offset = 0;
    }

    return item;
  }

  isEmpty() {
    return this.#items.length === this.#offset;
  }

  size() {
    return this.#items.length - this.#offset;
  }
}
