import { defineFallback } from './render';
import { DirectiveType, IS_HTML_RESULT } from './html';
import { attr } from './directives/attr';
import { text } from './directives/text';
import { sub } from './directives/sub';
import { on } from './directives/on';
import { prop } from './directives/prop';
import { list, key } from './directives/list';

export function applyDefaultFallback(): void {
  defineFallback(data => {
    if (data.type === DirectiveType.TEXT) {
      if (
        typeof data.staticValue === 'string' ||
        typeof data.staticValue === 'number'
      ) {
        data.directive = text(data.staticValue + '') as any;
      } else if (
        data.staticValue instanceof Array &&
        data.staticValue.findIndex(
          item => !(typeof item === 'object' && item[IS_HTML_RESULT])
        ) === -1
      ) {
        data.directive = list(data.staticValue);
      }
    }
    if (data.type === DirectiveType.ATTRIBUTE_VALUE) {
      if (data.attribute.startsWith('on')) {
        data.directive = on(data.attribute, data.staticValue) as any;
      } else if (data.attribute.startsWith('.')) {
        data.directive = prop(data.attribute, data.staticValue) as any;
      } else if (data.attribute === 'key') {
        data.directive = key(data.staticValue) as any;
      } else {
        data.directive = attr(data.attribute, data.staticValue + '') as any;
      }
    }

    if (
      data.type === DirectiveType.TEXT &&
      typeof data.staticValue === 'object' &&
      data.staticValue.dynamicData
    ) {
      data.directive = sub(data.staticValue) as any;
    }
    return data;
  });
}
