import IYieldResult from "./IYieldResult";

export default class Job {
    public static get STATUS_UNINITIALIZED(): number { return 0; }
    public static get STATUS_COMPLETE(): number { return 1; }
    public static get STATUS_YIELDED(): number { return 2; }
    public static get STATUS_CANCELLED(): number { return 3; }
    public static get STATUS_HELD(): number { return 4; }

    private status: number = Job.STATUS_UNINITIALIZED;
    private counterLabel: string = "";

    private predicate: (_: Job) => IYieldResult;

    public internalState: any = {};

    public get Status(): number { return this.status; }
    public get CounterLabel(): string { return this.counterLabel; }

    public constructor(predicate: (_: Job) => IYieldResult) {
        this.predicate = predicate;
    }

    public run(): IYieldResult {
        return this.predicate(this);
    }

    public yield(status: number, counterLabel: string = ""): IYieldResult {
        this.status = status;
        if (status === Job.STATUS_HELD
            || status === Job.STATUS_CANCELLED
            || status === Job.STATUS_COMPLETE) {
            this.counterLabel = counterLabel;
        }
        return {
            counterLabel: (status === Job.STATUS_HELD
                || status === Job.STATUS_CANCELLED
                || status === Job.STATUS_COMPLETE) ? counterLabel : "",
            job: this,
            status: status,
            type: "yield"
        };
    }
}
