import { WNode, WidgetBaseInterface, Constructor, WidgetMetaBase, WidgetMetaConstructor } from '@dojo/framework/widget-core/interfaces';
import { CustomComparator, harness } from '@dojo/framework/testing/harness';
import { SinonStub } from 'sinon';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';

export const noop: any = () => {};

export const stubEvent = {
	stopPropagation: noop,
	preventDefault: noop,
	target: {}
};

export const isStringComparator = (value: any) => typeof value === 'string';
export const isStringObjectComparator = (value: any) => Object.keys(value).every((key) => typeof value[key] === 'string');

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
	return (renderFunction: () => WNode<WidgetBaseInterface>, compares: CustomComparator[] = []) => {
		return harness(renderFunction, [ ...globalCompares, ...compares ]);
	};
};

export function MockMetaMixin<T extends Constructor<WidgetBase<any>>>(Base: T, mockStub: SinonStub): T {
	return class extends Base {
		protected meta<T extends WidgetMetaBase>(MetaType: WidgetMetaConstructor<T>): T {
			return mockStub(MetaType);
		}
	};
}
