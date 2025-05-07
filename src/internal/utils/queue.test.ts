import { expect, test } from "vitest";
import { Queue } from "./queue.js";

test("queue items", () => {
  const queue = new Queue<number>();

  expect(queue.isEmpty()).toBe(true);
  expect(queue.size()).toBe(0);
  expect(queue.pop()).toBe(undefined);

  queue.push(1);
  queue.push(2);
  queue.push(3);

  expect(queue.isEmpty()).toBe(false);
  expect(queue.size()).toBe(3);
  expect(queue.pop()).toBe(1);
  expect(queue.pop()).toBe(2);

  queue.push(4);

  expect(queue.isEmpty()).toBe(false);
  expect(queue.size()).toBe(2);
  expect(queue.pop()).toBe(3);
  expect(queue.pop()).toBe(4);

  expect(queue.isEmpty()).toBe(true);
  expect(queue.size()).toBe(0);
  expect(queue.pop()).toBe(undefined);
});
