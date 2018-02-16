const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { v, w } from '@dojo/widget-core/d';

import Icon from '../../index';
import * as iconCss from '../../../theme/icon.m.css';
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
		role: 'presentation',
		'aria-hidden': 'true',
		...overrides
	});
};

registerSuite('Input', {
	tests: {
		'renders with default properties'() {
			const h = harness(() => w<Icon>(Icon, {
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
