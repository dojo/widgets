const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/core/vdom';

import ListboxOption from '../../ListboxOption';
import * as css from '../../../theme/default/listbox.m.css';
import { noop, stubEvent } from '../../../common/tests/support/test-helpers';

registerSuite('ListboxOption', {
	tests: {
		'default render'() {
			const h = harness(() =>
				w(ListboxOption, {
					label: 'foo',
					id: 'bar',
					index: 0,
					option: 'baz'
				})
			);

			h.expect(() =>
				v(
					'div',
					{
						'aria-disabled': null,
						'aria-selected': 'false',
						classes: [],
						id: 'bar',
						role: 'option',
						onmousedown: noop
					},
					['foo']
				)
			);
		},

		'custom properties'() {
			const h = harness(() =>
				w(ListboxOption, {
					active: true,
					css: [css.option],
					disabled: true,
					label: 'foo',
					id: 'bar',
					index: 1,
					option: 'baz',
					selected: true
				})
			);

			h.expect(() =>
				v(
					'div',
					{
						'aria-disabled': 'true',
						'aria-selected': null,
						classes: [css.option],
						id: 'bar',
						role: 'option',
						onmousedown: noop
					},
					['foo']
				)
			);
		},

		'option click'() {
			const onClick = sinon.stub();
			const h = harness(() =>
				w(ListboxOption, {
					label: 'foo',
					id: 'bar',
					css: [css.option],
					index: 1,
					option: 'baz',
					onClick
				})
			);

			h.trigger(`.${css.option}`, 'onmousedown', stubEvent);
			assert.isTrue(onClick.calledWith('baz', 1));
		}
	}
});
