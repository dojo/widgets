import { create, destroy } from '@dojo/framework/core/vdom';
import global from '@dojo/framework/shim/global';

const factory = create({ destroy });
const bodyStyle = global.document.body.style;

export const bodyScroll = factory(function bodyScroll({ middleware: { destroy } }) {
	let disabled = false;
	let previousOverflow: string | undefined = undefined;

	const enableScroll = () => {
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

	const disableScroll = () => {
		if (disabled) {
			return;
		}

		disabled = true;
		previousOverflow = bodyStyle.getPropertyValue('overflow');
		bodyStyle.setProperty('overflow', 'hidden');
	};

	destroy(() => {
		disabled && enableScroll();
	});

	return (enable: boolean) => {
		enable ? enableScroll() : disableScroll();
	};
});

export default bodyScroll;
