import { create } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

interface RadioGroupICache {
	initial: string;
	value: string;
}

const icache = createICacheMiddleware<RadioGroupICache>();
const factory = create({ icache });

export const radioGroup = factory(({ middleware: { icache } }) => {
	return (onValue: (value: string) => void, initialValue: string) => {
		const existingInitialValue = icache.get('initial');

		if (existingInitialValue !== initialValue) {
			icache.set('value', initialValue);
			icache.set('initial', initialValue);
		}

		return (key: string) => ({
			checked(checked?: boolean) {
				const existingValue = icache.get('value');

				if (!checked && existingValue === key) {
					return existingValue === key && true;
				} else if (checked && existingValue !== key) {
					icache.set('value', key);
					onValue(key);
				}
			}
		});
	};
});
