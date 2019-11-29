# Workaholic
A job dispatch and yielding system for JavaScript and TypeScript

See [my blog post](https://www.skidsdev.xyz/post/post/10) for more info on this project.


## Usage

```ts
import { IYieldResult, Job, Workaholic } from "workaholic";

function* jobFunction(job: Job): IterableIterator<IYieldResult> {
  for (let i = 0; i < 100; i++) {
    console.log(i);
    yield job.yield(Job.STATUS_YIELDED);
  }
}

Workaholic.Instance.scheduleJob(new Job(jobFunction), Workaholic.PRIORITY_MED);

Workaholic.Instance.run();
```
