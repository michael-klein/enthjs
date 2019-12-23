export var DOMUpdateType;
(function (DOMUpdateType) {
    DOMUpdateType[DOMUpdateType["TEXT"] = 0] = "TEXT";
    DOMUpdateType[DOMUpdateType["REPLACE_NODE"] = 1] = "REPLACE_NODE";
    DOMUpdateType[DOMUpdateType["ADD_NODE"] = 2] = "ADD_NODE";
})(DOMUpdateType || (DOMUpdateType = {}));
export const IS_DIRECTIVE = Symbol('directive');
export function createDirective(factory) {
    return ((factory) => {
        const directive = function (...args) {
            return {
                is: IS_DIRECTIVE,
                factory,
                args,
            };
        };
        return directive;
    })(factory);
}
//# sourceMappingURL=directive.js.map