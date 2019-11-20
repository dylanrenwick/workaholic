import { expect } from "chai";
import Job from "../src/Job";

describe("Job class", () => {
    describe(".run()", () => {
        it("should run the job's predicate function", (done) => {
            const job: Job = new Job((j) => {
                done();
                return j.yield(Job.STATUS_COMPLETED);
            });
            job.run();
        });
    });

    describe(".yield(status: number, counterLabel: string)", () => {
        it("should store the yielded state", () => {
            const job: Job = new Job((j) => {
                return j.yield(Job.STATUS_COMPLETED);
            });
            job.run();
            expect(job.Status).to.equal(Job.STATUS_COMPLETED);
        });

        it("should return a valid IYieldResult", () => {
            const job: Job = new Job((j) => {
                return j.yield(Job.STATUS_COMPLETED, "label");
            });
            const result = job.run();
            expect(result.status).to.equal(Job.STATUS_COMPLETED);
            expect(result.type).to.equal("yield");
            expect(result.job).to.equal(job);
            expect(result.counterLabel).to.equal("label");
        });
    });
});
