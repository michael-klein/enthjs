export enum PriorityLevel {
  IMMEDIATE = 0, //synchronous
  USER_BLOCKING = 250, //.25s timeout
  NORMAL = 5000, // 5s timeout
  LOW = 10000, // 10s timeout
  IDLE = 99999999, // no timeout (run only when nothing else is scheduled)
}
type ScheduledJob = [() => void, number, number];
let scheduledJobs: ScheduledJob[] = [];
let schedulerRunning: boolean = false;
const MAX_ELAPSED: number = 17;
const processJobQueue = (
  queue: ScheduledJob[],
  now: number
): ScheduledJob[] => {
  return queue.filter(([cb, startTime, timeout]) => {
    const totalElapsed: number = Date.now() - now;
    const jobElapsed: number = Date.now() - startTime;
    if (jobElapsed > timeout || totalElapsed < MAX_ELAPSED) {
      cb();
      return false;
    } else {
      return true;
    }
  });
};
const processScheduledJobs = () => {
  const now: number = Date.now();
  const jobsToRun = scheduledJobs;
  scheduledJobs = [];
  const remainingJobs = processJobQueue(jobsToRun, now);
  scheduledJobs = remainingJobs.concat(scheduledJobs);
  if (scheduledJobs.length > 0) {
    requestAnimationFrame(processScheduledJobs);
  } else {
    schedulerRunning = false;
  }
};
export const schedule = (
  cb: () => void,
  priority: PriorityLevel = PriorityLevel.NORMAL
): Promise<void> => {
  if (priority === PriorityLevel.IMMEDIATE) {
    cb();
  } else {
    return new Promise(resolve => {
      scheduledJobs.push([
        () => {
          cb();
          resolve();
        },
        Date.now(),
        priority,
      ]);
      if (!schedulerRunning) {
        requestAnimationFrame(processScheduledJobs);
        schedulerRunning = true;
      }
    });
  }
  return Promise.resolve();
};
export type Schedule = typeof schedule;
