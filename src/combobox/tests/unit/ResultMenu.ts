import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

import harness, { assignChildProperties, assignProperties, Harness } from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import { WNode } from '@dojo/widget-core/interfaces';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';

import ResultItem, { ResultItemProperties } from '../../ResultItem';
import ResultMenu, { ResultMenuProperties } from '../../ResultMenu';
import * as css from '../../styles/comboBox.m.css';

const registry = new WidgetRegistry();
registry.define('result-item', ResultItem);

let widget: Harness<ResultMenuProperties, typeof ResultMenu>;

function createResultItem(
	index: number,
	result: string,
	selected: boolean,
	properties: ResultMenuProperties,
	isDisabled: (result: any) => boolean = widget.listener,
	theme: any = {}): WNode {
	return w<ResultItemProperties>('result-item', {
		index,
		key: String(index),
		result,
		selected,
		getResultLabel: properties.getResultLabel,
		isDisabled,
		onMouseDown: properties.onResultMouseDown,
		onMouseEnter: properties.onResultMouseEnter,
		onMouseUp: properties.onResultMouseUp,
		theme
	});
}

registerSuite({
	name: 'ResultMenu',

	beforeEach() {
		widget = harness(ResultMenu);
	},

	afterEach() {
		widget.destroy();
	},

	render() {
		const resultMenuProperties: ResultMenuProperties = {
			results: ['a', 'b'],
			registry: registry,
			selectedIndex: 0,
			getResultLabel: () => '',
			onResultMouseDown: () => true,
			onResultMouseEnter: () => true,
			onResultMouseUp: () => true
		};
		let expected = v('div', {
			classes: widget.classes(css.results),
			id: undefined,
			role: 'listbox'
		}, [
			createResultItem(0, 'a', true, resultMenuProperties),
			createResultItem(1, 'b', false, resultMenuProperties)
		]);

		widget.setProperties(resultMenuProperties);
		widget.expectRender(expected);
	},

	render2() {
		const resultMenuProperties: ResultMenuProperties = {
			id: 'foo',
			results: ['a', 'b'],
			registry: registry,
			selectedIndex: 0,
			theme: 'bar',
			getResultLabel: () => '',
			isResultDisabled: () => {
				called = true;
				return true;
			},
			onResultMouseDown: () => true,
			onResultMouseEnter: () => true,
			onResultMouseUp: () => true
		};
		let called = false;
		let expected = v('div', {
			classes: widget.classes(css.results),
			id: resultMenuProperties.id,
			role: 'listbox'
		}, [
			createResultItem(0, 'a', true, resultMenuProperties, resultMenuProperties.isResultDisabled, resultMenuProperties.theme),
			createResultItem(1, 'b', false, resultMenuProperties, resultMenuProperties.isResultDisabled, resultMenuProperties.theme)
		]);

		widget.setProperties(resultMenuProperties);
		widget.expectRender(expected);

		assert.isTrue(called, 'isResultDisabled should be called');
	}});
