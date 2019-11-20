export default class Queue<T> {
    private internalContainer: Array<T> = [];

    public get Count(): number { return this.internalContainer.length; }

    public enqueue(val: T): void {
        this.internalContainer.push(val);
    }

    public dequeue(): T | null {
        return this.internalContainer.shift() || null;
    }

    public peek(): T | null {
        return this.internalContainer[0] || null;
    }
}
