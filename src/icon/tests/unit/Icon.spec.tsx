const { registerSuite } = intern.getInterface('object');

import { v, w, tsx } from '@dojo/framework/core/vdom';

import Icon from '../../index';
import * as css from '../../../theme/default/icon.m.css';
import * as baseCss from '../../../common/styles/base.m.css';
import {
	createHarness,
	compareAria,
	compareAriaControls
} from '../../../common/tests/support/test-helpers';
import { assertionTemplate } from '@dojo/framework/testing/harness/assertionTemplate';

const harness = createHarness([compareAria, compareAriaControls]);

const expected = function(icon: keyof typeof css = 'downIcon', overrides = {}, altText?: string) {
	const children = [
		v('i', {
			classes: [undefined, css.icon, css[icon], undefined],
			'aria-hidden': 'true',
			...overrides
		})
	];

	if (altText) {
		children.push(v('span', { classes: baseCss.visuallyHidden }, [altText]));
	}

	return v('virtual', children);
};

registerSuite('Icon', {
	tests: {
		'renders with default properties'() {
			const h = harness(() =>
				w(Icon, {
					type: 'downIcon'
				})
			);
			h.expect(expected);
		},

		'custom properties'() {
			const h = harness(() =>
				w(Icon, {
					type: 'mailIcon',
					aria: {
						hidden: 'false'
					}
				})
			);
			h.expect(() => expected('mailIcon', { 'aria-hidden': 'false' }));
		},

		'alt text'() {
			const altText = 'Secure something';
			const h = harness(() =>
				w(Icon, {
					type: 'secureIcon',
					altText
				})
			);

			h.expect(() => expected('secureIcon', {}, altText));
		},
		'accepts a size'() {
			const h = harness(() =>
				w(Icon, {
					type: 'secureIcon',
					size: 'medium'
				})
			);

			const template = assertionTemplate(() => (
				<virtual>
					<i
						aria-hidden="true"
						classes={[undefined, css.icon, css.secureIcon, css.medium]}
					/>
				</virtual>
			));

			h.expect(template);
		}
	}
});
