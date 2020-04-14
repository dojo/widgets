import { create } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

interface CheckboxGroupICache {
	values: {
		[key: string]: boolean;
	};
	initial: string[];
}

const icache = createICacheMiddleware<CheckboxGroupICache>();
const factory = create({ icache });

export const checkboxGroup = factory(({ middleware: { icache } }) => {
	return (onValue: (value: string[]) => void, initialValue: string[] = [], value?: string[]) => {
		if (value === undefined) {
			const existingInitialValue = icache.get('initial');
			if (JSON.stringify(existingInitialValue) !== JSON.stringify(initialValue)) {
				icache.set(
					'values',
					initialValue.reduce((existing: any, value) => {
						existing[value] = true;
						return existing;
					}, {})
				);
				icache.set('initial', initialValue);
			}
		} else {
			icache.set(
				'values',
				value.reduce((existing: any, value) => {
					existing[value] = true;
					return existing;
				}, {})
			);
		}

		function getAllValues() {
			const currentValues = icache.get('values') || {};
			const keys = Object.keys(currentValues);

			return keys.reduce((values: string[], key: string) => {
				if (currentValues[key]) {
					values.push(key);
				}
				return values;
			}, []);
		}

		return (key: string) => ({
			checked(checked?: boolean) {
				const values = icache.getOrSet('values', {});

				if (checked === undefined) {
					return values[key];
				} else if (values[key] !== checked) {
					icache.set('values', { ...values, [key]: checked });
					onValue(getAllValues());
				}
			}
		});
	};
});
