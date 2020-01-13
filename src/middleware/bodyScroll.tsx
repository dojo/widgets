import { create, destroy } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import globalObject from '@dojo/framework/shim/global';

interface BodyScrollICache {
	disabled: boolean;
	previousOverflow: any;
}

const icache = createICacheMiddleware<BodyScrollICache>();
const factory = create({ icache, destroy });

const bodyStyle = globalObject.document.body.style;

export const bodyScroll = factory(function bodyScroll({ middleware: { icache, destroy } }) {
	const enable = () => {
		if (!icache.get('disabled')) {
			return;
		}
		const previousOverflow = icache.get('previousOverflow');
		if (previousOverflow) {
			bodyStyle.setProperty('overflow', previousOverflow);
		} else {
			bodyStyle.removeProperty('overflow');
		}
		icache.set('disabled', false);
		icache.set('previousOverflow', undefined);
	};

	const disable = () => {
		if (icache.get('disabled')) {
			return;
		}
		icache.set('disabled', true);
		icache.set('previousOverflow', bodyStyle.getPropertyValue('overflow'));
		bodyStyle.setProperty('overflow', 'hidden');
	};

	destroy(() => {
		if (icache.get('disabled')) {
			enable();
		}
	});

	return {
		enable,
		disable
	};
});

export default bodyScroll;
