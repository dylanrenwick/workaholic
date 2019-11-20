import AtomicCounter from "./AtomicCounter";
import IYieldResult from "./IYieldResult";
import Job from "./Job";
import Queue from "./Queue";

export default class Workaholic {
    public static get PRIORITY_LOW(): number { return 0; }
    public static get PRIORITY_MED(): number { return 1; }
    public static get PRIORITY_HIGH(): number { return 2; }

    private lowPriorityList: Queue<Job> = new Queue<Job>();
    private medPriorityList: Queue<Job> = new Queue<Job>();
    private highPriorityList: Queue<Job> = new Queue<Job>();

    private atomicCounters: Map<string, AtomicCounter> = new Map<string, AtomicCounter>();

    public get jobCount(): number {
        return this.lowPriorityList.Count + this.medPriorityList.Count + this.highPriorityList.Count;
    }

    public scheduleJob(job: Job, priority: number = Workaholic.PRIORITY_MED): void {
        const list: Queue<Job> | null = this.getListByPriority(priority);
        if (list !== null) list.enqueue(job);
    }

    public run(): void {
        while (this.jobCount > 0) {
            const priority: number | null = this.getNextJob();
            if (priority === null) continue;
            this.runJob(priority);
        }
    }

    private runJob(priority: number): void {
        const list: Queue<Job> | null = this.getListByPriority(priority);
        if (list === null) return;
        const job: Job | null = list.peek();
        if (job === null) return;
        const result: IYieldResult = job.run();
        this.processJobResult(result, list);
    }

    private getNextJob(): number | null {
        let job: Job | null = null;
        if (this.highPriorityList.Count > 0) {
            job = this.highPriorityList.peek();
        }
        if (this.isValidJob(job)) return Workaholic.PRIORITY_HIGH;
        if (this.medPriorityList.Count > 0) {
            job = this.medPriorityList.peek();
        }
        if (this.isValidJob(job)) return Workaholic.PRIORITY_MED;
        if (this.lowPriorityList.Count > 0) {
            job = this.lowPriorityList.peek();
        }

        if (this.isValidJob(job)) return Workaholic.PRIORITY_LOW;
        else return null;
    }

    private isValidJob(job: Job | null): boolean {
        if (job === null) return false;
        switch (job.Status) {
            case Job.STATUS_COMPLETE: // Complete
            case Job.STATUS_CANCELLED: // Cancelled
                return false;
            case Job.STATUS_UNINITIALIZED: // Not yet started
            case Job.STATUS_YIELDED: // Yielded
                return true;
            case Job.STATUS_HELD: // Awaiting counter
                if (job.CounterLabel === "") return true;
                const counter = this.getOrCreateAtomicCounter(job.CounterLabel);
                if (counter.Value === 0) return true;
                else return false;
            default: // Invalid status
                return false;
        }
    }

    private processJobResult(result: IYieldResult, jobList: Queue<Job>): void {
        switch (result.status) {
            case Job.STATUS_UNINITIALIZED:
            case Job.STATUS_COMPLETE:
            case Job.STATUS_CANCELLED:
                if (result.counterLabel) {
                    const counter = this.getOrCreateAtomicCounter(result.counterLabel);
                    counter.decrement();
                }
                jobList.dequeue();
                break;
            case Job.STATUS_HELD:
                // Move job to back of queue, and increment counter
                const counter = this.getOrCreateAtomicCounter(result.counterLabel);
                counter.increment();
            case Job.STATUS_YIELDED:
                const nextJob = jobList.dequeue();
                if (nextJob !== null) jobList.enqueue(nextJob);
            default:
                return;
        }
    }

    private getOrCreateAtomicCounter(label: string): AtomicCounter {
        let counter = this.atomicCounters.get(label);
        if (counter === null) {
            counter = new AtomicCounter();
            this.atomicCounters.set(label, counter);
        }
        return counter || new AtomicCounter();
    }

    private getListByPriority(priority: number): Queue<Job> | null {
        switch (priority) {
            case Workaholic.PRIORITY_LOW: return this.lowPriorityList;
            case Workaholic.PRIORITY_MED: return this.medPriorityList;
            case Workaholic.PRIORITY_HIGH: return this.highPriorityList;
            default: return null;
        }
    }
}
