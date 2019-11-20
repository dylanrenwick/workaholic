import { expect } from "chai";
import AtomicCounter from "../src/AtomicCounter";

describe("AtomicCounter class", () => {
    describe(".increment()", () => {
        it("should increment the value", () => {
            const counter: AtomicCounter = new AtomicCounter();
            expect(counter.Value).to.equal(0);
            counter.increment();
            expect(counter.Value).to.equal(1);
            counter.increment();
            expect(counter.Value).to.equal(2);
        });
    });

    describe(".decrement()", () => {
        it("should increment the value", () => {
            const counter: AtomicCounter = new AtomicCounter();
            counter.increment();
            counter.increment();
            expect(counter.Value).to.equal(2);
            counter.decrement();
            expect(counter.Value).to.equal(1);
            counter.decrement();
            expect(counter.Value).to.equal(0);
        });
    });
});
