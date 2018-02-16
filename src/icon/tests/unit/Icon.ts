const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { v, w } from '@dojo/widget-core/d';

import Icon from '../../Icon';
import * as iconCss from '../../../theme/common/icons.m.css';
import {
	createHarness,
	compareAria,
	compareAriaControls,
	noop
} from '../../../common/tests/support/test-helpers';

const harness = createHarness([ compareAria, compareAriaControls ]);

const expected = function(icon: keyof typeof iconCss = 'downIcon', overrides = {}) {
	return v('i', {
		classes: [
			iconCss.icon,
			iconCss[icon]
		],
		onclick: noop,
		...overrides
	});
};

registerSuite('Input', {
	tests: {
		'renders with default properties'() {
			const h = harness(() => w(Icon, { type: 'downIcon' }));
			h.expect(expected);
		},

		'custom properties'() {
			const h = harness(() => w(Icon, {
				type: 'mailIcon',
				aria: {
					hidden: 'true'
				}
			}));
			h.expect(() => expected('mailIcon', { 'aria-hidden': 'true' }));
		},

		events() {
			const onClick = sinon.stub();
			const stopPropagation = sinon.stub();

			const h = harness(() => w(Icon, {
				onClick,
				type: 'downIcon'
			}));

			h.trigger('i', 'onclick', { stopPropagation });
			assert.isTrue(onClick.called, 'onClick called');

		}
	}
});
