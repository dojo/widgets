import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

import harness, { assignProperties, Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import ResultItem, { ResultItemProperties } from '../../ResultItem';
import * as css from '../../styles/comboBox.m.css';

let widget: Harness<ResultItemProperties, typeof ResultItem>;

registerSuite({
	name: 'ResultItem',

	beforeEach() {
		widget = harness(ResultItem);
	},

	afterEach() {
		widget.destroy();
	},

	render() {
		let mousedown = false;
		let mouseenter = false;
		let mouseup = false;
		let resultItemProperties: ResultItemProperties = {
			index: 10,
			result: 'bar',
			selected: false,
			getResultLabel() {
				return 'foo';
			},
			isDisabled() {
				return false;
			},
			onMouseDown() {
				mousedown = true;
			},
			onMouseEnter() {
				mouseenter = true;
			},
			onMouseUp() {
				mouseup = true;
			}
		};
		let expected = v('div', {
			'aria-disabled': String(resultItemProperties.isDisabled(resultItemProperties.result)),
			'aria-selected': String(resultItemProperties.selected),
			classes: widget.classes(css.result),
			'data-selected': String(resultItemProperties.selected),
			role: 'option',
			onmousedown: widget.listener,
			onmouseenter: widget.listener,
			onmouseup: widget.listener
		}, [
			v('div', [ resultItemProperties.getResultLabel(resultItemProperties.result) ])
		]);

		widget.setProperties(resultItemProperties);

		widget.expectRender(expected);

		widget.sendEvent('mousedown');
		assert.isTrue(mousedown, 'mousedown event handler should be called');

		widget.sendEvent('mouseenter');
		assert.isTrue(mouseenter, 'mouseenter event handler should be called');

		widget.sendEvent('mouseup');
		assert.isTrue(mouseup, 'mouseup event handler should be called');

		resultItemProperties.selected = true;
		resultItemProperties.isDisabled = () => true;
		assignProperties(expected, {
			'aria-disabled': String(resultItemProperties.isDisabled(resultItemProperties.result)),
			'aria-selected': String(resultItemProperties.selected),
			classes: widget.classes(css.result, css.selectedResult, css.disabledResult),
			'data-selected':  String(resultItemProperties.selected)
		});

		widget.expectRender(expected);
	}
});
