import { Classes } from '@dojo/framework/core/mixins/Themed';

import { AriaPropertyObject } from './interfaces';

export enum Keys {
	Down = 40,
	End = 35,
	Enter = 13,
	Escape = 27,
	Home = 36,
	Left = 37,
	PageDown = 34,
	PageUp = 33,
	Right = 39,
	Space = 32,
	Tab = 9,
	Up = 38
}

export function formatAriaProperties(aria: AriaPropertyObject): AriaPropertyObject {
	const formattedAria = Object.keys(aria).reduce((a: AriaPropertyObject, key: string) => {
		a[`aria-${key.toLowerCase()}`] = aria[key];
		return a;
	}, {});
	return formattedAria;
}

export function mergeClasses(target: Classes, source: Classes = {}) {
	const classes: Classes = {};

	for (let widgetKey in target) {
		classes[widgetKey] = {};
		for (let classKey in target[widgetKey]) {
			classes[widgetKey][classKey] = target[widgetKey][classKey].slice(0);
		}
	}

	for (let widgetKey in source) {
		if (!classes.hasOwnProperty(widgetKey)) {
			classes[widgetKey] = {};
		}
		for (let classKey in source[widgetKey]) {
			if (!classes[widgetKey].hasOwnProperty(classKey)) {
				classes[widgetKey][classKey] = [];
			}
			classes[widgetKey][classKey] = [
				...classes[widgetKey][classKey],
				...source[widgetKey][classKey].slice(0)
			];
		}
	}

	return classes;
}
