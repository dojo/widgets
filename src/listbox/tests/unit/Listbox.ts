import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';

import harness, { Harness } from '@dojo/test-extras/harness';
import { assignProperties, assignChildProperties, compareProperty } from '@dojo/test-extras/support/d';
import { WNode } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import Listbox, { ListboxProperties } from '../../Listbox';
import ListboxOption from '../../ListboxOption';
import * as css from '../../styles/listbox.m.css';

let widget: Harness<ListboxProperties, typeof Listbox>;

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

interface TestEventInit extends EventInit {
	which: number;
}

const testOptions: any[] = [
	{
		label: 'One',
		value: 'one',
		id: 'first'
	},
	{
		label: 'Two',
		value: 'two'
	},
	{
		label: 'Three',
		value: 'three',
		disabled: true
	}
];

const expectedOptions = function(widget: any, activeIndex = 0) {
	return [
		w(ListboxOption, {
			active: activeIndex === 0,
			disabled: false,
			getOptionLabel: undefined,
			id: 'first',
			key: 'first',
			option: testOptions[0],
			selected: false,
			onClick: widget.listener,
			theme: undefined
		}),
		w(ListboxOption, {
			active: activeIndex === 1,
			disabled: false,
			getOptionLabel: undefined,
			id: <any> compareId,
			key: <any> compareId,
			option: testOptions[1],
			selected: false,
			onClick: widget.listener,
			theme: undefined
		}),
		w(ListboxOption, {
			active: activeIndex === 2,
			disabled: false,
			getOptionLabel: undefined,
			id: <any> compareId,
			key: <any> compareId,
			option: testOptions[2],
			selected: false,
			onClick: widget.listener,
			theme: undefined
		})
	];
};

const expectedVdom = function(widget: any, options: WNode[]) {
	return v('div', {
		'aria-activedescendant': compareId,
		'aria-multiselectable': null,
		classes: widget.classes(css.root),
		describedBy: undefined,
		id: undefined,
		role: 'listbox',
		tabIndex: 0,
		onkeydown: widget.listener
	}, options);
};

registerSuite({
	name: 'Listbox',

	beforeEach() {
		widget = harness(Listbox);
	},

	afterEach() {
		widget.destroy();
	},

	'empty listbox'() {
		widget.expectRender(expectedVdom(widget, []));
	},

	'options with default properties'() {
		widget.setProperties({ optionData: testOptions });
		const vdom = expectedVdom(widget, expectedOptions(widget));
		assignChildProperties(vdom, '0', {
			id: <any> compareId,
			key: <any> compareId
		});
		widget.expectRender(vdom);
	},

	'custom properties'() {
		widget.setProperties({
			activeIndex: 0,
			describedBy: 'foo',
			visualFocus: true,
			id: 'bar',
			multiselect: true,
			optionData: testOptions,
			tabIndex: -1,
			getOptionDisabled: (option: any) => !!option.disabled,
			getOptionId: (option: any, index: number) => option.id || `${index}`,
			getOptionLabel: (option: any) => option.label,
			getOptionSelected: (option: any, index: number) => index === 1
		});

		const vdom = expectedVdom(widget, expectedOptions(widget));
		assignProperties(vdom, {
			'aria-activedescendant': 'first',
			'aria-multiselectable': 'true',
			classes: widget.classes(css.root, css.focused),
			describedBy: 'foo',
			id: 'bar',
			tabIndex: -1
		});
		assignChildProperties(vdom, '0', {
			getOptionLabel: widget.listener
		});
		assignChildProperties(vdom, '1', {
			selected: true,
			getOptionLabel: widget.listener
		});
		assignChildProperties(vdom, '2', {
			disabled: true,
			getOptionLabel: widget.listener
		});
		widget.expectRender(vdom);
	},

	'onkeydown event'() {
		const onKeyDown = sinon.stub();
		widget.setProperties({ onKeyDown });

		widget.sendEvent('keydown');
		assert.isTrue(onKeyDown.called);
	},

	'arrow keys move active index'() {
		const onActiveIndexChange = sinon.stub();
		widget.setProperties({
			optionData: testOptions,
			onActiveIndexChange
		});

		widget.sendEvent<TestEventInit>('keydown', { eventInit: { which: Keys.Down } });
		assert.isTrue(onActiveIndexChange.calledWith(1), 'Down arrow moves to second option');

		widget.sendEvent<TestEventInit>('keydown', { eventInit: { which: Keys.Up } });
		assert.isTrue(onActiveIndexChange.calledWith(2), 'Up arrow moves to last option');
	},

	'home and end move active index'() {
		const onActiveIndexChange = sinon.stub();
		widget.setProperties({
			activeIndex: 1,
			optionData: testOptions,
			onActiveIndexChange
		});

		widget.sendEvent<TestEventInit>('keydown', { eventInit: { which: Keys.Home } });
		assert.isTrue(onActiveIndexChange.calledWith(0), 'Home key moves to first option');

		widget.sendEvent<TestEventInit>('keydown', { eventInit: { which: Keys.End } });
		assert.isTrue(onActiveIndexChange.calledWith(2), 'End key moves to last option');
	},

	'clicking selects option and moves active index'() {
		const onActiveIndexChange = sinon.stub();
		const onOptionSelect = sinon.stub();
		widget.setProperties({
			activeIndex: 1,
			getOptionId: (option: any, index: number) => `${index}`,
			optionData: testOptions,
			onActiveIndexChange,
			onOptionSelect
		});

		widget.callListener('onClick', { args: [testOptions[0]], key: '0' });
		assert.isTrue(onActiveIndexChange.calledWith(0), 'Clicking first option moves active index');
		assert.isTrue(onOptionSelect.calledWith(testOptions[0], 0), 'Clicking first option selects it');
	},

	'keyboard selects active option'() {
		const onOptionSelect = sinon.stub();
		widget.setProperties({
			activeIndex: 1,
			key: 'foo',
			optionData: testOptions,
			onOptionSelect
		});

		widget.sendEvent<TestEventInit>('keydown', { eventInit: { which: Keys.Enter } });
		assert.isTrue(onOptionSelect.calledWith(testOptions[1], 1, 'foo'), 'Enter key selects option');

		widget.setProperties({
			activeIndex: 0,
			key: 'foo',
			optionData: testOptions,
			onOptionSelect
		});
		widget.getRender();

		widget.sendEvent<TestEventInit>('keydown', { eventInit: { which: Keys.Space } });
		assert.isTrue(onOptionSelect.calledWith(testOptions[0], 0, 'foo'), 'Space key selects option');
	},

	'disabled options are not selected'() {
		const onOptionSelect = sinon.stub();
		widget.setProperties({
			activeIndex: 2,
			optionData: testOptions,
			getOptionId: (option: any, index: number) => `${index}`,
			getOptionDisabled: (option: any) => !!option.disabled,
			onOptionSelect
		});

		widget.sendEvent<TestEventInit>('keydown', { eventInit: { which: Keys.Enter } });
		assert.isFalse(onOptionSelect.called, 'Enter key does not select disabled option');

		widget.sendEvent<TestEventInit>('keydown', { eventInit: { which: Keys.Space } });
		assert.isFalse(onOptionSelect.called, 'Space key does not select disabled option');

		widget.callListener('onClick', { key: '2' });
		assert.isFalse(onOptionSelect.called, 'Clicking disabled option does not select it');
	}
});
