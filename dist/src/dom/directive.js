export var DOMUpdateType;
(function (DOMUpdateType) {
    DOMUpdateType[DOMUpdateType["TEXT"] = 0] = "TEXT";
    DOMUpdateType[DOMUpdateType["REPLACE_NODE"] = 1] = "REPLACE_NODE";
    DOMUpdateType[DOMUpdateType["ADD_NODE"] = 2] = "ADD_NODE";
    DOMUpdateType[DOMUpdateType["PREPEND_NODE"] = 3] = "PREPEND_NODE";
    DOMUpdateType[DOMUpdateType["INSERT_BEFORE"] = 4] = "INSERT_BEFORE";
    DOMUpdateType[DOMUpdateType["INSERT_AFTER"] = 5] = "INSERT_AFTER";
    DOMUpdateType[DOMUpdateType["REMOVE"] = 6] = "REMOVE";
    DOMUpdateType[DOMUpdateType["ADD_CLASS"] = 7] = "ADD_CLASS";
    DOMUpdateType[DOMUpdateType["REMOVE_CLASS"] = 8] = "REMOVE_CLASS";
    DOMUpdateType[DOMUpdateType["SET_ATTRIBUTE"] = 9] = "SET_ATTRIBUTE";
    DOMUpdateType[DOMUpdateType["CUSTOM"] = 10] = "CUSTOM";
})(DOMUpdateType || (DOMUpdateType = {}));
export const IS_DIRECTIVE = Symbol.for('directive');
export function createDirective(factory) {
    return ((factory) => {
        const directive = function (...args) {
            return {
                [IS_DIRECTIVE]: true,
                factory,
                args,
                directive,
            };
        };
        return directive;
    })(factory);
}
//# sourceMappingURL=directive.js.map