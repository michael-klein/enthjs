export var DOMUpdateType = {};
(function (DOMUpdateType) {
  DOMUpdateType['TEXT'] = 'TEXT';
  DOMUpdateType['REPLACE_NODE'] = 'REPLACE_NODE';
  DOMUpdateType['ADD_NODE'] = 'ADD_NODE';
  DOMUpdateType['PREPEND_NODE'] = 'PREPEND_NODE';
  DOMUpdateType['INSERT_BEFORE'] = 'INSERT_BEFORE';
  DOMUpdateType['INSERT_AFTER'] = 'INSERT_AFTER';
  DOMUpdateType['REMOVE'] = 'REMOVE';
  DOMUpdateType['ADD_CLASS'] = 'ADD_CLASS';
  DOMUpdateType['REMOVE_CLASS'] = 'REMOVE_CLASS';
  DOMUpdateType['SET_ATTRIBUTE'] = 'SET_ATTRIBUTE';
  DOMUpdateType['CUSTOM'] = 'CUSTOM';
})(DOMUpdateType || (DOMUpdateType = {}));
export const IS_DIRECTIVE = Symbol.for('directive');
export function createDirective (factory) {
  return (factory => {
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
