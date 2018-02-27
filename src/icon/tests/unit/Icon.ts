const { registerSuite } = intern.getInterface('object');

import { v, w } from '@dojo/widget-core/d';

import Icon from '../../index';
import * as css from '../../../theme/icon.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import {
	createHarness,
	compareAria,
	compareAriaControls
} from '../../../common/tests/support/test-helpers';

const harness = createHarness([ compareAria, compareAriaControls ]);

const expected = function(icon: keyof typeof css = 'downIcon', overrides = {}, altText?: string) {
	const children = [
		v('i', {
			classes: [
				css.icon,
				css[icon]
			],
			'aria-hidden': 'true',
			...overrides
		})
	];

	if (altText) {
		children.push(v('span', { classes: [ baseCss.visuallyHidden ] }, [ altText ]));
	}

	return v('span', { classes: css.root }, children);
};

registerSuite('Icon', {
	tests: {
		'renders with default properties'() {
			const h = harness(() => w(Icon, {
				type: 'downIcon'
			}));
			h.expect(expected);
		},

		'custom properties'() {
			const h = harness(() => w(Icon, {
				type: 'mailIcon',
				aria: {
					hidden: 'false'
				}
			}));
			h.expect(() => expected('mailIcon', { 'aria-hidden': 'false' }));
		},

		'alt text'() {
			const altText = 'Secure something';
			const h = harness(() => w(Icon, {
				type: 'secureIcon',
				altText
			}));

			h.expect(() => expected('secureIcon', {}, altText));
		}
	}
});
