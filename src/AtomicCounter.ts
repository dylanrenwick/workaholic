export default class AtomicCounter {
    private value: number = 0;

    public get Value(): number { return this.value; }

    public increment(): void { this.value++; }
    public decrement(): void { this.value--; }
}
