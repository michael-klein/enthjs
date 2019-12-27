import { createDirective, DOMUpdateType } from "../directive.js";
export const clss = createDirective(function* (node, classes) {
    if (node instanceof HTMLElement) {
        let oldClasses = [];
        for (;;) {
            const result = [];
            oldClasses.forEach(oldCls => result.push({
                type: DOMUpdateType.REMOVE_CLASS,
                node,
                value: oldCls,
            }));
            oldClasses = classes.trim().split(' ');
            oldClasses.forEach(cls => result.push({
                type: DOMUpdateType.ADD_CLASS,
                node,
                value: cls,
            }));
            classes = (yield result)[0];
        }
    }
});
//# sourceMappingURL=clss.js.map