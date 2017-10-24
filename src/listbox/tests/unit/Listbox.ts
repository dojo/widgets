const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import harness, { Harness } from '@dojo/test-extras/harness';
import { assignProperties, assignChildProperties, compareProperty } from '@dojo/test-extras/support/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../../../common/util';

import Listbox, { ListboxProperties, ListboxOption, ListboxOptionProperties } from '../../Listbox';
import * as css from '../../styles/listbox.m.css';

let widget: Harness<ListboxProperties, typeof Listbox>;
let optionWidget: Harness<ListboxOptionProperties, typeof ListboxOption>;

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
		v('div', { key: 'first' }, [
			w(ListboxOption, {
				active: activeIndex === 0,
				classes: [ css.option, css.activeOption, null, null ],
				disabled: false,
				id: 'first',
				key: 'option-0',
				label: '[object Object]',
				option: testOptions[0],
				selected: false,
				onClick: widget.listener,
				theme: undefined
			})
		]),
		v('div', { key: <any> compareId }, [
			w(ListboxOption, {
				active: activeIndex === 1,
				classes: [ css.option, null, null, null ],
				disabled: false,
				id: <any> compareId,
				key: 'option-1',
				label: '[object Object]',
				option: testOptions[1],
				selected: false,
				onClick: widget.listener,
				theme: undefined
			})
		]),
		v('div', { key: <any> compareId }, [
			w(ListboxOption, {
				active: activeIndex === 2,
				classes: [ css.option, null, null, null ],
				disabled: false,
				id: <any> compareId,
				key: 'option-2',
				label: '[object Object]',
				option: testOptions[2],
				selected: false,
				onClick: widget.listener,
				theme: undefined
			})
		])
	];
};

const expectedVdom = function(widget: any, options: DNode[]) {
	return v('div', {
		'aria-activedescendant': compareId,
		'aria-multiselectable': null,
		classes: widget.classes(css.root),
		describedBy: undefined,
		id: undefined,
		key: 'root',
		role: 'listbox',
		tabIndex: 0,
		onkeydown: widget.listener
	}, options);
};

registerSuite('Listbox', {
	beforeEach() {
		widget = harness(Listbox);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'empty listbox'() {
			widget.expectRender(expectedVdom(widget, []));
		},

		'options with default properties'() {
			widget.setProperties({ optionData: testOptions });
			const vdom = expectedVdom(widget, expectedOptions(widget));
			assignChildProperties(vdom, '0', {
				key: <any> compareId
			});
			assignChildProperties(vdom, '0,0', {
				id: <any> compareId
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
				theme: {},
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
			assignChildProperties(vdom, '0,0', {
				label: 'One',
				theme: {}
			});
			assignChildProperties(vdom, '1,0', {
				classes: <any> [ css.option, null, null, css.selectedOption ],
				label: 'Two',
				selected: true,
				theme: {}
			});
			assignChildProperties(vdom, '2,0', {
				classes: <any> [ css.option, null, css.disabledOption, null ],
				disabled: true,
				label: 'Three',
				theme: {}
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
				optionData: testOptions,
				onActiveIndexChange,
				onOptionSelect
			});

			widget.callListener('onClick', { args: [testOptions[0]], key: 'option-0' });
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
				getOptionDisabled: (option: any) => !!option.disabled,
				onOptionSelect
			});

			widget.sendEvent<TestEventInit>('keydown', { eventInit: { which: Keys.Enter } });
			assert.isFalse(onOptionSelect.called, 'Enter key does not select disabled option');

			widget.sendEvent<TestEventInit>('keydown', { eventInit: { which: Keys.Space } });
			assert.isFalse(onOptionSelect.called, 'Space key does not select disabled option');

			widget.callListener('onClick', { key: 'option-2' });
			assert.isFalse(onOptionSelect.called, 'Clicking disabled option does not select it');
		},

		'scroll to active option below the viewport'() {
			const scrollStub = sinon.stub();
			class StubDimensions {
				public get(key: any) {
					if (key === 'root') {
						return {
							scroll: { top: 0 },
							offset: { height: 200 }
						};
					}
					else {
						return {
							offset: {
								top: 300,
								height: 50
							}
						};
					}
				}
			};
			class ScrollListbox extends Listbox {
				animateScroll(element: HTMLElement, scrollValue: number) {
					scrollStub(scrollValue);
				};
				meta(MetaType: any): any {
					return new StubDimensions();
				}
			}
			widget = harness(ScrollListbox);
			widget.setProperties({ activeIndex: 3 });
			widget.getRender();

			assert.isTrue(scrollStub.calledWith(150));
		},

		'scroll to active option above the viewport'() {
			const scrollStub = sinon.stub();
			class StubDimensions {
				public get(key: any) {
					if (key === 'root') {
						return {
							scroll: { top: 300 },
							offset: { height: 200 }
						};
					}
					else {
						return {
							offset: {
								top: 100,
								height: 50
							}
						};
					}
				}
			};
			class ScrollListbox extends Listbox {
				animateScroll(element: HTMLElement, scrollValue: number) {
					scrollStub(scrollValue);
				};
				meta(MetaType: any): any {
					return new StubDimensions();
				}
			}
			widget = harness(ScrollListbox);
			widget.setProperties({ activeIndex: 0 });
			widget.getRender();

			// onElementUpdated
			scrollStub.reset();
			widget.setProperties({});
			widget.getRender();

			assert.isTrue(scrollStub.calledWith(100));
		}
	}
});

registerSuite('ListboxOption', {
	beforeEach() {
		optionWidget = harness(ListboxOption);
	},

	afterEach() {
		optionWidget.destroy();
	},

	tests: {
		'default render'() {
			optionWidget.setProperties({
				label: 'foo',
				id: 'bar',
				option: 'baz'
			});

			optionWidget.expectRender(v('div', {
				'aria-disabled': null,
				'aria-selected': 'false',
				classes: optionWidget.classes(),
				id: 'bar',
				role: 'option',
				onclick: optionWidget.listener
			}, [ 'foo' ]));
		},

		'custom properties'() {
			optionWidget.setProperties({
				active: true,
				classes: [ css.option ],
				disabled: true,
				label: 'foo',
				id: 'bar',
				option: 'baz',
				selected: true
			});

			optionWidget.expectRender(v('div', {
				'aria-disabled': 'true',
				'aria-selected': null,
				classes: optionWidget.classes(css.option),
				id: 'bar',
				role: 'option',
				onclick: optionWidget.listener
			}, [ 'foo' ]));
		},

		'option click'() {
			const onClick = sinon.stub();
			optionWidget.setProperties({
				label: 'foo',
				id: 'bar',
				option: 'baz',
				onClick
			});

			optionWidget.sendEvent('click');
			assert.isTrue(onClick.calledWith('baz'));
		}
	}
});
