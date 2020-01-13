import { defineFallback } from './render';
import { DirectiveType } from './html';
import { attr } from './directives/attr';
import { text } from './directives/text';
import { sub } from './directives/sub';

export function applyDefaultFallback(): void {
  defineFallback(data => {
    if (
      data.type === DirectiveType.TEXT &&
      (typeof data.staticValue === 'string' ||
        typeof data.staticValue === 'number')
    ) {
      data.directive = text(data.staticValue + '') as any;
    }
    if (
      data.type === DirectiveType.ATTRIBUTE_VALUE &&
      (typeof data.staticValue === 'string' ||
        typeof data.staticValue === 'number')
    ) {
      data.directive = attr(data.attribute, data.staticValue + '') as any;
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
