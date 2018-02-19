import { WNode, WidgetBaseInterface, Constructor, WidgetMetaBase, WidgetMetaConstructor } from '@dojo/widget-core/interfaces';
import { CustomComparator, harness } from '@dojo/test-extras/harness';
import { SinonStub } from 'sinon';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

export const noop: any = () => {};

export const stubEvent = {
	stopPropagation: noop
};

export const isStringComparator = (value: any) => typeof value === 'string';
export const isStringObjectComparator = (value: any) => Object.keys(value).every((key) => typeof value[key] === 'string');

export const compareId = {
	selector: '*',
	property: 'id',
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

export const compareLabelId = {
	selector: '*',
	property: 'labelId',
	comparator: (property: any) => typeof property === 'string'
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
