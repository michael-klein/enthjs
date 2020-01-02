export declare enum PriorityLevel {
    IMMEDIATE = 0,
    USER_BLOCKING = 250,
    NORMAL = 5000,
    LOW = 10000,
    IDLE = 99999999
}
export declare const schedule: (cb: () => void, priority?: PriorityLevel) => Promise<void>;
export declare type Schedule = typeof schedule;
