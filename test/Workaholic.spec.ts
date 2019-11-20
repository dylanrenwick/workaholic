import { expect } from "chai";
import sinon from "ts-sinon";
import Job from "../src/Job";
import Workaholic from "../src/Workaholic";

describe("Workaholic class", () => {
    afterEach(() => {
        // Clear all jobs after each test
        (Workaholic.Instance as any).highPriorityList.clear();
        (Workaholic.Instance as any).medPriorityList.clear();
        (Workaholic.Instance as any).lowPriorityList.clear();
    });

    describe(":Instance", () => {
        it("should always return the same instance", () => {
            expect(Workaholic.Instance).to.equal(Workaholic.Instance);
        });
    });

    describe(".JobCount", () => {
        it("should return the number of queued jobs", () => {
            expect(Workaholic.Instance.jobCount).to.equal(0);
            Workaholic.Instance.scheduleJob(new Job(function*(j) { }));
            expect(Workaholic.Instance.jobCount).to.equal(1);
            Workaholic.Instance.scheduleJob(new Job(function*(j) { }));
            expect(Workaholic.Instance.jobCount).to.equal(2);
        });

        it("should return the number of queued jobs across all queues", () => {
            expect(Workaholic.Instance.jobCount).to.equal(0);
            Workaholic.Instance.scheduleJob(new Job(function*(j) { }), Workaholic.PRIORITY_HIGH);
            expect(Workaholic.Instance.jobCount).to.equal(1);
            Workaholic.Instance.scheduleJob(new Job(function*(j) { }), Workaholic.PRIORITY_MED);
            expect(Workaholic.Instance.jobCount).to.equal(2);
            Workaholic.Instance.scheduleJob(new Job(function*(j) { }), Workaholic.PRIORITY_LOW);
            expect(Workaholic.Instance.jobCount).to.equal(3);
        });
    });

    describe(".scheduleJob(job: Job)", () => {
        it("should add a job to the queue", () => {
            expect(Workaholic.Instance.jobCount).to.equal(0);
            Workaholic.Instance.scheduleJob(new Job(function*(j) { }));
            expect(Workaholic.Instance.jobCount).to.equal(1);
            Workaholic.Instance.scheduleJob(new Job(function*(j) { }));
            expect(Workaholic.Instance.jobCount).to.equal(2);
        });
    });

    describe(".run()", () => {
        it("should immediately exit if there are no scheduled jobs", (done) => {
            Workaholic.Instance.run();
            done();
        });

        it("should run scheduled jobs", (done) => {
            Workaholic.Instance.scheduleJob(new Job(function*(j) {
                done();
                return j.yield(Job.STATUS_COMPLETED);
            }));
            Workaholic.Instance.run();
        });

        it("should exit once there are no more scheduled jobs", (done) => {
            Workaholic.Instance.scheduleJob(new Job(function*(j) { }));
            Workaholic.Instance.run();
            done();
        });

        it("should run scheduled jobs in priority order", () => {
            const first = sinon.spy();
            const second = sinon.spy();
            const third = sinon.spy();
            Workaholic.Instance.scheduleJob(new Job(function*(j) { first(); }), Workaholic.PRIORITY_HIGH);
            Workaholic.Instance.scheduleJob(new Job(function*(j) { second(); }), Workaholic.PRIORITY_MED);
            Workaholic.Instance.scheduleJob(new Job(function*(j) { third(); }), Workaholic.PRIORITY_LOW);
            Workaholic.Instance.run();
            expect(first.calledBefore(second)).to.be.true;
            expect(first.calledBefore(third)).to.be.true;
            expect(second.calledBefore(third)).to.be.true;
        });

        it("should run jobs until they complete", (done) => {
            Workaholic.Instance.scheduleJob(new Job(function*(j) {
                for (let i = 0; i < 5; i++) {
                    yield j.yield(Job.STATUS_YIELDED);
                }
            }));
            Workaholic.Instance.run();
            done();
        });

        it("should push yielding jobs to the back of the queue", (done) => {
            const first = sinon.spy();
            const second = sinon.spy();
            const third = sinon.spy();
            Workaholic.Instance.scheduleJob(new Job(function*(j) {
                first();
                yield j.yield(Job.STATUS_YIELDED);
                third();
            }));
            Workaholic.Instance.scheduleJob(new Job(function*(j) { second(); }));
            Workaholic.Instance.run();
            expect(first.calledBefore(second)).to.be.true;
            expect(first.calledBefore(third)).to.be.true;
            expect(second.calledBefore(third)).to.be.true;
            done();
        });
    });
});
