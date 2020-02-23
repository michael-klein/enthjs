let scheduledJobs = [];
let schedulerRunning = false;
export const PriorityLevel = {
  IMMEDIATE: 0, //synchronous
  USER_BLOCKING: 250, //.25s timeout
  NORMAL: 5000, // 5s timeout
  LOW: 10000, // 10s timeout
  IDLE: 99999999 // no timeout (run only when nothing else is scheduled)
};
const MAX_ELAPSED = 17;
const immediate = [];
function processImmediate() {
  while (immediate.length > 0) {
    const cb = immediate.shift();
    cb();
  }
}
const processJobQueue = (queue, now) => {
  let index = 0;
  for (let length = queue.length; index < length; index++) {
    processImmediate();
    const totalElapsed = Date.now() - now;
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
  const now = Date.now();
  scheduledJobs = processJobQueue(
    scheduledJobs.sort((a, b) => (a[1] < b[1] ? -1 : 1)),
    now
  );
  processImmediate();
  if (scheduledJobs.length > 0) {
    requestAnimationFrame(processScheduledJobs);
  } else {
    schedulerRunning = false;
  }
};
export const schedule = (cb, priority = PriorityLevel.NORMAL) => {
  if (priority === PriorityLevel.IMMEDIATE) {
    if (!schedulerRunning) {
      cb();
    } else {
      immediate.push(cb);
    }
  } else {
    return new Promise(resolve => {
      scheduledJobs.push([
        () => {
          cb();
          resolve();
        },
        Date.now() + priority
      ]);
      if (!schedulerRunning) {
        requestAnimationFrame(processScheduledJobs);
        schedulerRunning = true;
      }
    });
  }
  return Promise.resolve();
};
