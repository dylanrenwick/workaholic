import IYieldResult from "./IYieldResult";

export default class Job {
    public static get STATUS_UNINITIALIZED(): number { return 0; }
    public static get STATUS_COMPLETED(): number { return 1; }
    public static get STATUS_YIELDED(): number { return 2; }
    public static get STATUS_CANCELLED(): number { return 3; }
    public static get STATUS_HELD(): number { return 4; }

    private status: number = Job.STATUS_UNINITIALIZED;
    private counterLabel: string = "";

    private predicate: (_: Job) => IterableIterator<IYieldResult>;
    private iterator: IterableIterator<IYieldResult>;

    public internalState: any = {};

    public get Status(): number { return this.status; }
    public get CounterLabel(): string { return this.counterLabel; }

    public constructor(predicate: (_: Job) => IterableIterator<IYieldResult>) {
        this.predicate = predicate;
        this.iterator = this.predicate(this);
    }

    public run(): IYieldResult {
        const next = this.iterator.next();
        if (next.value === undefined) return this.yield(Job.STATUS_COMPLETED, this.counterLabel);
        return next.value;
    }

    public yield(status: number, counterLabel: string = ""): IYieldResult {
        this.status = status;
        if (status === Job.STATUS_HELD
            || status === Job.STATUS_CANCELLED
            || status === Job.STATUS_COMPLETED) {
            this.counterLabel = counterLabel;
        }
        return {
            counterLabel: (status === Job.STATUS_HELD
                || status === Job.STATUS_CANCELLED
                || status === Job.STATUS_COMPLETED) ? counterLabel : "",
            done: (status === Job.STATUS_CANCELLED || status === Job.STATUS_COMPLETED),
            job: this,
            status: status,
            type: "yield"
        };
    }
}
