import {
	WNode,
	Constructor,
	MetaBase,
	WidgetMetaConstructor
} from '@dojo/framework/core/interfaces';
import { CustomComparator, harness } from '@dojo/framework/testing/harness';
import { SinonStub } from 'sinon';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';

export const noop: any = () => {};

export const stubEvent = {
	stopPropagation: noop,
	preventDefault: noop,
	target: {}
};

export const isStringComparator = (value: any) => value === null || typeof value === 'string';
export const isStringObjectComparator = (value: any) =>
	Object.keys(value).every((key) => value[key] === null || typeof value[key] === 'string');
export const isFocusedComparator = (value: () => boolean) => value() === true;
export const isNotFocusedComparator = (value: () => boolean) => value() === false;

export const compareId = {
	selector: '*',
	property: 'id',
	comparator: isStringComparator
};

export const compareWidgetId = {
	selector: '*',
	property: 'widgetId',
	comparator: isStringComparator
};

export const compareForId = {
	selector: '*',
	property: 'forId',
	comparator: isStringComparator
};

export const compareAria = {
	selector: '*',
	property: 'aria',
	comparator: isStringObjectComparator
};

export const compareAriaControls = {
	selector: '*',
	property: 'aria-controls',
	comparator: isStringComparator
};

export const compareAriaLabelledBy = {
	selector: '*',
	property: 'aria-labelledby',
	comparator: isStringComparator
};

export const compareAriaOwns = {
	selector: '*',
	property: 'aria-owns',
	comparator: isStringComparator
};

export const compareAriaDescribedBy = {
	selector: '*',
	property: 'aria-describedby',
	comparator: isStringComparator
};

export const compareLabelId = {
	selector: '*',
	property: 'labelId',
	comparator: isStringComparator
};

export const createHarness = (globalCompares: CustomComparator[]) => {
	return (renderFunction: () => WNode, compares: CustomComparator[] = []) => {
		return harness(renderFunction, [...globalCompares, ...compares]);
	};
};

export function MockMetaMixin<T extends Constructor<WidgetBase<any>>>(
	Base: T,
	mockStub: SinonStub
): T {
	return class extends Base {
		protected meta<T extends MetaBase>(MetaType: WidgetMetaConstructor<T>): T {
			return mockStub(MetaType);
		}
	};
}

const themeComparator = (css: any) => (value: any) => {
	const { ' _key': key, ...classes } = css;
	return JSON.stringify(classes) === JSON.stringify(value[key]);
};

export const compareTheme = (css: any) => ({
	selector: '*',
	property: 'theme',
	comparator: themeComparator(css)
});
