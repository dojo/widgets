const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import ListboxOption from '../../ListboxOption';
import * as css from '../../../theme/listbox/listbox.m.css';

let widget: Harness<ListboxOption>;

registerSuite('ListboxOption', {
	beforeEach() {
		widget = harness(ListboxOption);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'default render'() {
			widget.setProperties({
				label: 'foo',
				id: 'bar',
				index: 0,
				option: 'baz'
			});

			widget.expectRender(v('div', {
				'aria-disabled': null,
				'aria-selected': 'false',
				classes: null,
				id: 'bar',
				role: 'option',
				onclick: widget.listener
			}, [ 'foo' ]));
		},

		'custom properties'() {
			widget.setProperties({
				active: true,
				classes: [ css.option ],
				disabled: true,
				label: 'foo',
				id: 'bar',
				index: 1,
				option: 'baz',
				selected: true
			});

			widget.expectRender(v('div', {
				'aria-disabled': 'true',
				'aria-selected': null,
				classes: [ css.option ],
				id: 'bar',
				role: 'option',
				onclick: widget.listener
			}, [ 'foo' ]));
		},

		'option click'() {
			const onClick = sinon.stub();
			widget.setProperties({
				label: 'foo',
				id: 'bar',
				index: 1,
				option: 'baz',
				onClick
			});

			widget.sendEvent('click');
			assert.isTrue(onClick.calledWith('baz', 1));
		}
	}
});
