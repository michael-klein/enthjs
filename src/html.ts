const isLetter = (c: string): boolean => {
  return c.toLowerCase() != c.toUpperCase();
};

export enum DirectiveType {
  TEXT,
  ATTRIBUTE,
  ATTRIBUTE_VALUE,
}
export interface DirectiveData {
  d: Function;
  t?: DirectiveType;
  a?: string;
  n?: Node;
  c?: () => void;
}
const insertAttributeMarker = (
  marker: string,
  si: number,
  appendedStatic: string
): string => {
  while (si++) {
    const char = appendedStatic.charAt(si);
    if (!char) {
      break;
    }
    if (char === ' ') {
      return (
        appendedStatic.slice(0, si) + ' ' + marker + appendedStatic.slice(si)
      );
    }
  }
  return appendedStatic;
};
export const getTextMarker = (id: number): string => {
  return `tm-${id}`;
};
export const getAttributeMarker = (id: number): string => {
  return `data-am-${id}`;
};
export interface HTMLResult {
  template: HTMLTemplateElement;
  directives: DirectiveData[];
}
let resultCache: WeakMap<TemplateStringsArray, HTMLResult> = new WeakMap();
export const html = (
  staticParts: TemplateStringsArray,
  ...dynamicParts: any[]
): HTMLResult => {
  let result: HTMLResult = resultCache.get(staticParts);
  if (!result) {
    let appendedStatic: string = '';
    const directives: DirectiveData[] = [];
    for (let i = 0; i < dynamicParts.length; i++) {
      const dynamicPart = dynamicParts[i];
      const staticPart = staticParts[i];
      appendedStatic += staticPart;
      if (typeof dynamicPart !== 'function') {
        appendedStatic += dynamicPart;
        continue;
      }
      let id =
        directives.push({
          d: dynamicPart,
        }) - 1;
      let si = appendedStatic.length + 1;
      let attributeValueMode = false;
      let attributeMode = false;
      let attributeNameFound = false;
      let attributeName = '';
      while (si--) {
        const char = appendedStatic.charAt(si);
        const nextChar = appendedStatic.charAt(si - 1);
        const nextNextChar = appendedStatic.charAt(si - 2);
        if (char === '>' || si === 0) {
          let marker = getTextMarker(id);
          appendedStatic += `<${marker}>&zwnj;</${marker}>`;
          directives[id].t = DirectiveType.TEXT;
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
          appendedStatic = insertAttributeMarker(
            getAttributeMarker(id),
            si,
            appendedStatic
          );
          directives[id].t = DirectiveType.ATTRIBUTE_VALUE;
          directives[id].a = attributeName;
          if (appendedStatic[appendedStatic.length - 1] === ' ') {
            appendedStatic = appendedStatic.slice(0, appendedStatic.length - 1);
          }
          break;
        }
        if (char === '<' && !attributeValueMode) {
          appendedStatic = insertAttributeMarker(
            getAttributeMarker(id),
            si,
            appendedStatic
          );
          directives[id].t = DirectiveType.ATTRIBUTE;
          break;
        }
      }
    }
    appendedStatic += staticParts[staticParts.length - 1];
    const template = document.createElement('template');
    template.innerHTML = appendedStatic;
    result = {
      template,
      directives,
    };
  } else {
    let directiveIndex: number = 0;
    dynamicParts.forEach((value: any) => {
      if (typeof value === 'function') {
        result.directives[directiveIndex].d = value;
        directiveIndex++;
      }
    });
  }
  resultCache.set(staticParts, result);
  return result;
};
