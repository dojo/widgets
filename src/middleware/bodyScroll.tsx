import { create, destroy } from '@dojo/framework/core/vdom';
import globalObject from '@dojo/framework/shim/global';

const factory = create({ destroy });
const bodyStyle = globalObject.document.body.style;

export const bodyScroll = factory(function bodyScroll({ middleware: { destroy } }) {
	let disabled = false;
	let previousOverflow: string | undefined = undefined;

	const enable = () => {
		if (!disabled) {
			return;
		}

		if (previousOverflow) {
			bodyStyle.setProperty('overflow', previousOverflow);
		} else {
			bodyStyle.removeProperty('overflow');
		}
		disabled = false;
		previousOverflow = undefined;
	};

	const disable = () => {
		if (disabled) {
			return;
		}

		disabled = true;
		previousOverflow = bodyStyle.getPropertyValue('overflow');
		bodyStyle.setProperty('overflow', 'hidden');
	};

	destroy(() => {
		disabled && enable();
	});

	return (enableScroll: boolean) => {
		enableScroll ? enable() : disable();
	};
});

export default bodyScroll;
