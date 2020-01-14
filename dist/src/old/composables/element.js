import { getOnlySetupError } from "../errors.js";
const global = window;
export const setUpContext = (context, cb) => {
    global.__$c = context;
    cb();
    global.__$c = undefined;
};
export const getElement = () => {
    if (global.__$c) {
        return global.__$c;
    }
    else {
        throw getOnlySetupError('getElement');
    }
};
//# sourceMappingURL=element.js.map