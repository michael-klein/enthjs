import { IS_DIRECTIVE, DirectiveResult } from './directive';

const isLetter = (c: string): boolean => {
  return c.toLowerCase() != c.toUpperCase();
};

export enum DirectiveType {
  TEXT,
  ATTRIBUTE,
  ATTRIBUTE_VALUE,
}

export interface DynamicData {
  directive?: DirectiveResult;
  staticValue?: any;
  marker?: string;
  type?: DirectiveType;
  attribute?: string;
  dx?: number;
  staticParts: TemplateStringsArray;
}

export const getTextMarker = (id: number): string => {
  return `tm-${id}`;
};

export const getAttributeMarker = (id: number): string => {
  return `data-am-${id}`;
};

export interface HTMLResult {
  dynamicData: DynamicData[];
  staticParts: TemplateStringsArray;
  key?: string;
}
export type HTML = typeof html;
export function isDirective(thing: any): boolean {
  return typeof thing === 'object' && thing[IS_DIRECTIVE];
}
let resultCache: WeakMap<TemplateStringsArray, HTMLResult> = new WeakMap();
export const html = (
  staticParts: TemplateStringsArray,
  ...dynamicParts: any[]
): HTMLResult => {
  let result: HTMLResult = resultCache.get(staticParts);
  if (!result) {
    let appendedStatic: string = '';
    const dynamicData: DynamicData[] = [];
    for (let i = 0; i < dynamicParts.length; i++) {
      const dynamicPart = dynamicParts[i];
      const staticPart = staticParts[i];
      appendedStatic += staticPart;
      let dx: number = 0;
      let id = dynamicData.push({ staticParts }) - 1;
      const currentDynamicData: DynamicData = dynamicData[id];
      if (isDirective(dynamicPart)) {
        currentDynamicData.directive = dynamicPart;
      } else {
        currentDynamicData.staticValue = dynamicPart;
      }
      let si = appendedStatic.length + 1;
      let attributeValueMode = false;
      let attributeMode = false;
      let attributeNameFound = false;
      let attributeName = '';
      while (si--) {
        dx++;
        const char = appendedStatic.charAt(si);
        const nextChar = appendedStatic.charAt(si - 1);
        const nextNextChar = appendedStatic.charAt(si - 2);
        if (char === '>' || si === 0) {
          let marker = getTextMarker(id);
          currentDynamicData.marker = `<${marker}>&zwnj;</${marker}>`;
          currentDynamicData.type = DirectiveType.TEXT;
          break;
        }
        if (
          char === '"' &&
          nextChar === '=' &&
          isLetter(nextNextChar) &&
          !attributeMode
        ) {
          attributeValueMode = true;
          continue;
        }
        if (char === '"' && nextNextChar !== '=' && !attributeValueMode) {
          attributeValueMode = false;
          attributeMode = true;
          continue;
        }
        if (
          attributeValueMode &&
          char !== '"' &&
          char !== '=' &&
          !attributeNameFound
        ) {
          if (char !== ' ') {
            attributeName = char + attributeName;
          } else {
            attributeNameFound = true;
          }
        }
        if (char === '<' && attributeValueMode) {
          currentDynamicData.marker = getAttributeMarker(id);
          currentDynamicData.type = DirectiveType.ATTRIBUTE_VALUE;
          currentDynamicData.attribute = attributeName;
          break;
        }
        if (char === '<' && !attributeValueMode) {
          currentDynamicData.marker = getAttributeMarker(id);
          currentDynamicData.type = DirectiveType.ATTRIBUTE;
          break;
        }
      }
      currentDynamicData.dx = dx;
    }
    appendedStatic += staticParts[staticParts.length - 1];
    result = {
      dynamicData,
      staticParts,
    };
    resultCache.set(staticParts, result);
  } else {
    result = {
      ...result,
      dynamicData: result.dynamicData.map((data, id) => {
        if (!isDirective(dynamicParts[id])) {
          return {
            ...data,
            directive: undefined,
            staticValue: dynamicParts[id],
          };
        } else {
          return {
            ...data,
            staticValue: undefined,
            directive: dynamicParts[id],
          };
        }
      }),
    };
  }
  return result;
};
