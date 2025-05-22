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

  peek(): T | undefined {
    return this.#offset < this.#items.length
      ? this.#items[this.#offset]
      : undefined;
  }

  pop(): T | undefined {
    const item = this.peek();
    if (item !== undefined) {
      ++this.#offset;

      // Clean up to prevent memory leak.
      if (this.#offset * 2 >= this.#items.length) {
        this.#items = this.#items.slice(this.#offset);
        this.#offset = 0;
      }
    }
    return item;
  }
}
