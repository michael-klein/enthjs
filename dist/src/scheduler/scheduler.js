export var PriorityLevel;
(function (PriorityLevel) {
    PriorityLevel[PriorityLevel["IMMEDIATE"] = 0] = "IMMEDIATE";
    PriorityLevel[PriorityLevel["USER_BLOCKING"] = 250] = "USER_BLOCKING";
    PriorityLevel[PriorityLevel["NORMAL"] = 5000] = "NORMAL";
    PriorityLevel[PriorityLevel["LOW"] = 10000] = "LOW";
    PriorityLevel[PriorityLevel["IDLE"] = 99999999] = "IDLE";
})(PriorityLevel || (PriorityLevel = {}));
let scheduledJobs = [];
let schedulerRunning = false;
const MAX_ELAPSED = 17;
const processJobQueue = (queue, now) => {
    let index = 0;
    for (let length = queue.length; index < length; index++) {
        const totalElapsed = Date.now() - now;
        const [cb, latestEndTime] = queue[index];
        if (now >= latestEndTime || totalElapsed < MAX_ELAPSED) {
            cb();
        }
        else {
            break;
        }
    }
    return queue.slice(index);
};
const processScheduledJobs = () => {
    const now = Date.now();
    console.log(scheduledJobs.length);
    scheduledJobs = processJobQueue(scheduledJobs.sort((a, b) => (a[1] < b[1] ? -1 : 1)), now);
    if (scheduledJobs.length > 0) {
        requestAnimationFrame(processScheduledJobs);
    }
    else {
        schedulerRunning = false;
    }
};
export const schedule = (cb, priority = PriorityLevel.NORMAL) => {
    if (priority === PriorityLevel.IMMEDIATE) {
        cb();
    }
    else {
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
//# sourceMappingURL=scheduler.js.map