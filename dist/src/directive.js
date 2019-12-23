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