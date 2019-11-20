import { expect } from "chai";
import Queue from "../src/Queue";

describe("Queue class", () => {
    describe(".enqueue(val: T)", () => {
        it("should add the given value to the queue", () => {
            const queue = new Queue<string>();
            queue.enqueue("first");
            expect(queue.Count).to.equal(1);
            expect(queue.peek()).to.equal("first");
        });

        it("should add the given value to the beginning of the queue", () => {
            const queue = new Queue<string>();
            queue.enqueue("first");
            queue.enqueue("second");
            expect(queue.peek()).to.equal("first");
        });
    });

    describe(".dequeue()", () => {
        it("should remove the first item", () => {
            const queue = new Queue<string>();
            queue.enqueue("first");
            queue.enqueue("second");
            expect(queue.Count).to.equal(2);
            queue.dequeue();
            expect(queue.Count).to.equal(1);
            queue.dequeue();
            expect(queue.Count).to.equal(0);
        });

        it("should remove the first item and return it", () => {
            const queue = new Queue<string>();
            queue.enqueue("first");
            queue.enqueue("second");
            expect(queue.dequeue()).to.equal("first");
            expect(queue.dequeue()).to.equal("second");
        });
    });

    describe(".Count", () => {
        it("should return the number of items in the queue", () => {
            const queue = new Queue<string>();
            expect(queue.Count).to.equal(0);
            queue.enqueue("first");
            expect(queue.Count).to.equal(1);
            queue.enqueue("second");
            expect(queue.Count).to.equal(2);
        });
    });

    describe(".peek()", () => {
        it("should return the first item without modifying the queue", () => {
            const queue = new Queue<string>();
            queue.enqueue("first");
            queue.enqueue("second");
            const beforeCount = queue.Count;
            expect(queue.peek()).to.equal("first");
            expect(queue.Count).to.equal(beforeCount);
        });
    });
});
