import { create } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

interface RadioGroupICache {
	initial: string;
	value: string;
}

const icache = createICacheMiddleware<RadioGroupICache>();
const factory = create({ icache });

export const radioGroup = factory(({ middleware: { icache } }) => {
	return (onValue: (value: string) => void, initialValue: string, value?: string) => {
		if (value === undefined) {
			const existingInitialValue = icache.get('initial');

			if (existingInitialValue !== initialValue) {
				icache.set('value', initialValue);
				icache.set('initial', initialValue);
			}
		}

		return (key: string) => {
			function checked(): boolean;
			function checked(checked: boolean): void;
			function checked(checked?: boolean): boolean | void {
				const existingValue = value === undefined ? icache.get('value') : value;

				if (checked === undefined) {
					return existingValue === key;
				} else if (checked && existingValue !== key) {
					icache.set('value', key);
					onValue(key);
				}
			}

			return {
				checked
			};
		};
	};
});
