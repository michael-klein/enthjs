export enum PriorityLevel {
  IMMEDIATE = 0, //synchronous
  USER_BLOCKING = 250, //.25s timeout
  NORMAL = 5000, // 5s timeout
  LOW = 10000, // 10s timeout
  IDLE = 99999999, // no timeout (run only when nothing else is scheduled)
}
type ScheduledJob = [() => void, number];
let scheduledJobs: ScheduledJob[] = [];
let schedulerRunning: boolean = false;
const MAX_ELAPSED: number = 17;
const processJobQueue = (
  queue: ScheduledJob[],
  now: number
): ScheduledJob[] => {
  let index = 0;
  for (let length = queue.length; index < length; index++) {
    const totalElapsed: number = Date.now() - now;
    const [cb, latestEndTime] = queue[index];
    if (now >= latestEndTime || totalElapsed < MAX_ELAPSED) {
      cb();
    } else {
      break;
    }
  }
  return queue.slice(index);
};
const processScheduledJobs = () => {
  const now: number = Date.now();
  scheduledJobs = processJobQueue(
    scheduledJobs.sort((a, b) => (a[1] < b[1] ? -1 : 1)),
    now
  );
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
        Date.now() + priority,
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
