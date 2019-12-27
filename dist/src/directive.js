export var DOMUpdateType;
(function (DOMUpdateType) {
    DOMUpdateType[DOMUpdateType["TEXT"] = 0] = "TEXT";
    DOMUpdateType[DOMUpdateType["REPLACE_NODE"] = 1] = "REPLACE_NODE";
    DOMUpdateType[DOMUpdateType["ADD_NODE"] = 2] = "ADD_NODE";
    DOMUpdateType[DOMUpdateType["INSERT_BEFORE"] = 3] = "INSERT_BEFORE";
    DOMUpdateType[DOMUpdateType["REMOVE"] = 4] = "REMOVE";
    DOMUpdateType[DOMUpdateType["ADD_CLASS"] = 5] = "ADD_CLASS";
    DOMUpdateType[DOMUpdateType["REMOVE_CLASS"] = 6] = "REMOVE_CLASS";
})(DOMUpdateType || (DOMUpdateType = {}));
export const IS_DIRECTIVE = Symbol('directive');
export function createDirective(factory) {
    return ((factory) => {
        const directive = function (...args) {
            return {
                is: IS_DIRECTIVE,
                factory,
                args,
                directive,
            };
        };
        return directive;
    })(factory);
}
//# sourceMappingURL=directive.js.map