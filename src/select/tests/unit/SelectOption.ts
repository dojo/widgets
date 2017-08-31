import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';

import harness, { Harness } from '@dojo/test-extras/harness';
import { assignProperties } from '@dojo/test-extras/support/d';
import { v } from '@dojo/widget-core/d';

import SelectOption, { SelectOptionProperties, OptionData } from '../../SelectOption';
import * as css from '../../styles/select.m.css';

let widget: Harness<SelectOptionProperties, typeof SelectOption>;
let testData: OptionData;

const expected = function(widget: any) {
	return v('div', {
		role: 'option',
		id: undefined,
		classes: widget.classes(css.option),
		'aria-disabled': null,
		'aria-selected': 'false',
		onclick: widget.listener,
		onmousedown: widget.listener
	}, [ 'bar' ]);
};

registerSuite({
	name: 'SelectOption',

	beforeEach() {
		widget = harness(SelectOption);
		testData = {
			label: 'bar',
			value: '42'
		};
	},

	afterEach() {
		widget.destroy();
	},

	'Render correct properties'() {
		widget.setProperties({
			index: 0,
			optionData: testData
		});

		widget.expectRender(expected(widget));
	},

	'custom properties'() {
		testData.selected = true;
		testData.disabled = true;
		testData.id = 'foo';

		widget.setProperties({
			focused: true,
			index: 0,
			optionData: testData
		});

		const expectedVdom = expected(widget);
		assignProperties(expectedVdom, {
			'aria-disabled': 'true',
			'aria-selected': 'true',
			id: 'foo',
			classes: widget.classes(css.option, css.focused, css.selected, css.disabledOption)
		});

		widget.expectRender(expectedVdom);
	},

	'click events'() {
		const onClick = sinon.stub();
		const onMouseDown = sinon.stub();

		widget.setProperties({
			index: 0,
			optionData: testData,
			onClick,
			onMouseDown
		});

		widget.sendEvent('click');
		assert.isTrue(onClick.called, 'click handler called');
		assert.strictEqual(onClick.getCall(0).args[1], 0, 'click hander called with correct index');

		widget.sendEvent('mousedown');
		assert.isTrue(onMouseDown.called, 'mousedown handler called');
	}
});
