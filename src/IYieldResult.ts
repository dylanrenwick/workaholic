import Job from "./Job";

export default interface IYieldResult {
    type: string;
    job: Job;
    status: number;
    counterLabel: string;
    done: boolean;
}
