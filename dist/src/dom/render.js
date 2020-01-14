import { DirectiveType, getTextMarker, getAttributeMarker, } from "./html.js";
import { DOMUpdateType } from "./directive.js";
import { schedule, PriorityLevel } from "../scheduler/scheduler.js";
const renderedNodesMap = new WeakMap();
export const clear = (container) => {
    if (renderedNodesMap.has(container)) {
        renderedNodesMap
            .get(container)
            .forEach(node => container.removeChild(node));
        renderedNodesMap.delete(container);
    }
};
let currentFallback = data => data;
export function defineFallback(fallback) {
    currentFallback = fallback;
}
const insertAttributeMarker = (marker, si, appendedStatic) => {
    while (si++) {
        const char = appendedStatic.charAt(si);
        if (!char) {
            break;
        }
        if (char === ' ') {
            return (appendedStatic.slice(0, si) + ' ' + marker + appendedStatic.slice(si));
        }
    }
    return appendedStatic;
};
function createTemplate(htmlResult) {
    let appendedStatic = '';
    const { dynamicData, staticParts } = htmlResult;
    for (let i = 0; i < dynamicData.length; i++) {
        let data = applyFallback(dynamicData[i], currentFallback);
        const staticPart = staticParts[i];
        appendedStatic += staticPart;
        if (data.staticValue) {
            appendedStatic += data.staticValue;
        }
        else {
            switch (data.type) {
                case DirectiveType.TEXT:
                    appendedStatic += data.marker;
                    break;
                case DirectiveType.ATTRIBUTE_VALUE:
                case DirectiveType.ATTRIBUTE:
                    appendedStatic = insertAttributeMarker(data.marker, appendedStatic.length + 1 - data.dx, appendedStatic);
                    break;
            }
        }
    }
    appendedStatic += staticParts[staticParts.length - 1];
    const template = document.createElement('template');
    template.innerHTML = appendedStatic.trim();
    return template;
}
const generatorMap = new WeakMap();
function processTemplate(template, container, htmlResult) {
    const generators = [];
    generatorMap.set(container, generators);
    const fragment = template.content;
    const { dynamicData } = htmlResult;
    dynamicData.forEach((data, id) => {
        if (data.directive) {
            switch (data.type) {
                case DirectiveType.TEXT:
                    const textMarker = getTextMarker(id);
                    const placeholder = fragment.querySelector(textMarker);
                    let textNode;
                    let isTextArea = false;
                    if (placeholder) {
                        textNode = placeholder.firstChild;
                    }
                    else {
                        isTextArea = true;
                        const textareas = fragment.querySelectorAll('textarea');
                        for (let i = 0; i < textareas.length; i++) {
                            const area = textareas[i];
                            if (area.innerText.includes(textMarker)) {
                                textNode = area.firstChild;
                                break;
                            }
                        }
                    }
                    generators[id] = data.directive.factory.call({ type: data.type }, textNode, ...data.directive.args);
                    if (!isTextArea) {
                        placeholder.parentNode.replaceChild(textNode, placeholder);
                    }
                    break;
                case DirectiveType.ATTRIBUTE:
                case DirectiveType.ATTRIBUTE_VALUE:
                    const marker = getAttributeMarker(id);
                    const node = fragment.querySelector(`[${marker}]`);
                    generators[id] = data.directive.factory.call({ type: data.type }, node, ...data.directive.args);
                    node.removeAttribute(marker);
            }
        }
    });
    renderedNodesMap.set(container, Array.from(fragment.childNodes));
}
function applyFallback(data, fallback) {
    if (!data.directive) {
        Object.assign(data, fallback(data));
        if (data.directive) {
            data.staticValue = undefined;
        }
    }
    return data;
}
const containerDataCache = new WeakMap();
export const render = (container, htmlResult) => {
    let fragment;
    let init = false;
    const dataCache = containerDataCache.get(container) || {};
    containerDataCache.set(container, dataCache);
    if (!renderedNodesMap.has(container)) {
        init = true;
        const template = createTemplate(htmlResult);
        processTemplate(template, container, htmlResult);
        fragment = template.content;
    }
    const generators = generatorMap.get(container);
    if (dataCache.staticParts !== htmlResult.staticParts) {
        dataCache.staticParts = htmlResult.staticParts;
        dataCache.states = [];
        dataCache.prevValues = [];
    }
    const promise = Promise.all(htmlResult.dynamicData.map(async (data, id) => {
        if (!dataCache.prevValues[id]) {
            dataCache.prevValues[id] = [];
        }
        data = applyFallback(data, currentFallback);
        if (data.directive) {
            if (dataCache.prevValues[id].length !== data.directive.args.length ||
                dataCache.prevValues[id].findIndex((arg, index) => data.directive.args[index] !== arg ||
                    data.directive.args[index] instanceof Object) > -1) {
                if (dataCache.states[id] === undefined) {
                    dataCache.states[id] = {};
                }
                const result = await generators[id].next(data.directive.args);
                const domUpdates = await result.value;
                dataCache.prevValues[id].length = 0;
                dataCache.prevValues[id].push(...data.directive.args);
                if (domUpdates) {
                    return schedule(() => {
                        domUpdates.forEach(d => {
                            switch (d.type) {
                                case DOMUpdateType.TEXT:
                                    d.node.textContent = d.value;
                                    break;
                                case DOMUpdateType.ADD_NODE:
                                    d.node.appendChild(d.newNode);
                                    break;
                                case DOMUpdateType.REPLACE_NODE:
                                    d.node.parentNode.replaceChild(d.newNode, d.node);
                                    break;
                                case DOMUpdateType.INSERT_BEFORE:
                                    d.node.parentNode.insertBefore(d.newNode, d.node);
                                    break;
                                case DOMUpdateType.REMOVE:
                                    d.node.parentNode.removeChild(d.node);
                                    break;
                                case DOMUpdateType.ADD_CLASS:
                                    d.node.classList.add(d.value);
                                    break;
                                case DOMUpdateType.REMOVE_CLASS:
                                    d.node.classList.remove(d.value);
                                    break;
                                case DOMUpdateType.SET_ATTRIBUTE:
                                    d.node.setAttribute(d.name, d.value);
                                    break;
                            }
                        });
                    }, init ? PriorityLevel.IMMEDIATE : undefined);
                }
            }
        }
    })).then(() => { });
    if (fragment) {
        container.appendChild(fragment);
    }
    return promise;
};
//# sourceMappingURL=render.js.map