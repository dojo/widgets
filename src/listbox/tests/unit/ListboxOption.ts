import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';

import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import ListboxOption, { ListboxOptionProperties } from '../../ListboxOption';
import * as css from '../../styles/listbox.m.css';

let widget: Harness<ListboxOptionProperties, typeof ListboxOption>;

const properties = {
	id: 'foo',
	option: 'bar'
};

registerSuite({
	name: 'Listbox',

	beforeEach() {
		widget = harness(ListboxOption);
	},

	afterEach() {
		widget.destroy();
	},

	'default properties'() {
		widget.setProperties(properties);
		widget.expectRender(v('div', {
			'aria-disabled': null,
			'aria-selected': 'false',
			classes: widget.classes(css.option),
			id: 'foo',
			role: 'option',
			onclick: widget.listener
		}, [ 'bar' ]));
	},

	'custom properties'() {
		widget.setProperties({
			...properties,
			active: true,
			disabled: true,
			getOptionLabel: (option: any) => '42',
			selected: true
		});
		widget.expectRender(v('div', {
			'aria-disabled': 'true',
			'aria-selected': null,
			classes: widget.classes(css.option, css.activeOption, css.disabledOption, css.selectedOption),
			id: 'foo',
			role: 'option',
			onclick: widget.listener
		}, [ '42' ]));
	},

	'click handler'() {
		const onClick = sinon.stub();
		widget.setProperties({
			...properties,
			onClick
		});

		widget.sendEvent('click');
		assert.isTrue(onClick.called);
	}
});
