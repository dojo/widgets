import {
	WNode,
	Constructor,
	MetaBase,
	WidgetMetaConstructor,
	MiddlewareResultFactory,
	DefaultMiddlewareResult
} from '@dojo/framework/core/interfaces';
import { CustomComparator, harness } from '@dojo/framework/testing/harness/harness';
import { SinonStub } from 'sinon';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { createMemoryResourceTemplate } from '@dojo/framework/core/middleware/resources';

export const noop: any = () => {};

export const stubEvent = {
	stopPropagation: noop,
	preventDefault: noop,
	target: {}
};

export const isResourceComparator = (value: any) => Boolean(value && value.template);
export const isObjectComparator = (value: any) => typeof value === 'object';
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

interface HarnessOptions {
	customComparator?: CustomComparator[];
	middleware?: [MiddlewareResultFactory<any, any, any, any>, () => DefaultMiddlewareResult][];
}

export const createHarness = (globalCompares: CustomComparator[]) => {
	return (renderFunction: () => WNode, options: CustomComparator[] | HarnessOptions = []) => {
		if (Array.isArray(options)) {
			return harness(renderFunction, [...globalCompares, ...options]);
		} else {
			return harness(renderFunction, {
				...options,
				customComparator: [...globalCompares, ...(options.customComparator || [])]
			});
		}
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

export const compareTheme = {
	selector: '*',
	property: 'theme',
	comparator: isObjectComparator
};

export const compareResource = {
	selector: '*',
	property: 'resource',
	comparator: isResourceComparator
};

export function createTestResource(data: any[], options?: any, transform?: any) {
	return {
		template: {
			id: 'test',
			template: createMemoryResourceTemplate<any>(),
			initOptions: { id: 'test', data },
			transform
		},
		options
	};
}
