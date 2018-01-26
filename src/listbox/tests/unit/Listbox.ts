const { assert } = intern.getPlugin('chai');
const { registerSuite } = intern.getInterface('object');
import * as sinon from 'sinon';

import { DNode, WNode } from '@dojo/widget-core/interfaces';
import harness, { CustomComparator } from '@dojo/test-extras/harness';
import { Keys } from '../../../common/util';
// import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
// import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import Listbox from '../../Listbox';
import ListboxOption, { ListboxOptionProperties } from '../../ListboxOption';
import * as css from '../../../theme/listbox/listbox.m.css';

const compareId = { selector: '*', property: 'id', comparator: (property: any) => typeof property === 'string' };
const compareKey = { selector: '*', property: 'key', comparator: (property: any) => typeof property === 'string' };
const compareAriaActiveDescendant = { selector: '*', property: 'aria-activedescendant', comparator: (property: any) => typeof property === 'string' };
const noop = () => {};
const createHarnessWithCompare = (renderFunction: () => WNode, comparators: CustomComparator[] = []) => {
	return harness(renderFunction, [ compareId, compareAriaActiveDescendant, ...comparators ]);
};

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

const expectedFirstOption = (overrides: Partial<ListboxOptionProperties> = {}) => {
	return v('div', { key: 'first' }, [
		w(ListboxOption, {
			active: false,
			classes: [ css.option, css.activeOption, null, null ],
			disabled: false,
			id: 'first',
			index: 0,
			key: 'option-0',
			label: '[object Object]',
			option: testOptions[0],
			selected: false,
			onClick: noop,
			theme: undefined,
			...overrides
		})
	]);
};

const expectedSecondOption = (overrides: Partial<ListboxOptionProperties> = {}) => {
	return v('div', { key: '1' }, [
		w(ListboxOption, {
			active: false,
			classes: [ css.option, null, null, null ],
			disabled: false,
			id: '',
			index: 1,
			key: 'option-1',
			label: '[object Object]',
			option: testOptions[1],
			selected: false,
			onClick: noop,
			theme: undefined,
			...overrides
		})
	]);
};

const expectedThirdOption = (overrides: Partial<ListboxOptionProperties> = {}) => {
	return v('div', { key: '2' }, [
		w(ListboxOption, {
			active: false,
			classes: [ css.option, null, null, null ],
			disabled: false,
			id: '',
			index: 2,
			key: 'option-2',
			label: '[object Object]',
			option: testOptions[2],
			selected: false,
			onClick: noop,
			theme: undefined,
			...overrides
		})
	]);
};

const expectedOptions = function(activeIndex = 0) {
	return [
		expectedFirstOption({ active: activeIndex === 0 }),
		expectedSecondOption({ active: activeIndex === 1 }),
		expectedThirdOption({ active: activeIndex === 2 })
	];
};

const expectedVdom = function(options: DNode[] = []) {
	return v('div', {
		'aria-activedescendant': '',
		'aria-multiselectable': null,
		classes: [ css.root, null ],
		id: undefined,
		key: 'root',
		role: 'listbox',
		tabIndex: 0,
		onkeydown: noop
	}, options);
};

registerSuite('Listbox', {
	tests: {
		'empty listbox'() {
			const h = createHarnessWithCompare(() =>  w(Listbox, {}));
			h.expect(() => expectedVdom());
		},

		'options with default properties'() {
			const h = createHarnessWithCompare(() =>  w(Listbox, {
				optionData: testOptions
			}), [ compareKey ]);
			h.expect(() => expectedVdom(expectedOptions()));
		},

		'custom properties'() {
			const h = createHarnessWithCompare(() =>  w(Listbox, {
				activeIndex: 0,
				aria: { describedBy: 'foo' },
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
			}));

			h.expect(() => v('div', {
				'aria-activedescendant': 'first',
				'aria-describedby': 'foo',
				'aria-multiselectable': 'true',
				classes: [ css.root, css.focused ],
				id: 'bar',
				tabIndex: -1,
				key: 'root',
				role: 'listbox',
				onkeydown: noop
			}, [
				expectedFirstOption({
					label: 'One',
					active: true,
					theme: {}
				}),
				expectedSecondOption({
					classes: [ css.option, null, null, css.selectedOption ],
					label: 'Two',
					selected: true,
					theme: {}
				}),
				expectedThirdOption({
					classes: <any> [ css.option, null, css.disabledOption, null ],
					disabled: true,
					label: 'Three',
					theme: {}
				})
			]));
		},

		'onkeydown event'() {
			const onKeyDown = sinon.stub();
			const h = createHarnessWithCompare(() =>  w(Listbox, { onKeyDown }));
			h.trigger('@root', 'onkeydown', { eventInit: { which: Keys.Down } });
			assert.isTrue(onKeyDown.called);
		},

		'arrow keys move active index'() {
			const onActiveIndexChange = sinon.stub();
			const h = createHarnessWithCompare(() =>  w(Listbox, {
				optionData: testOptions,
				onActiveIndexChange
			}));
			h.trigger('@root', 'onkeydown', { which: Keys.Down, preventDefault: sinon.stub() });
			assert.isTrue(onActiveIndexChange.calledWith(1), 'Down arrow moves to second option');
			h.trigger('@root', 'onkeydown', { which: Keys.Up, preventDefault: sinon.stub() });
			assert.isTrue(onActiveIndexChange.calledWith(1), 'Up arrow moves to last option');
		},

		'home and end move active index'() {
			const onActiveIndexChange = sinon.stub();
			const h = createHarnessWithCompare(() =>  w(Listbox, {
				activeIndex: 1,
				optionData: testOptions,
				onActiveIndexChange
			}));

			h.trigger('@root', 'onkeydown', { which: Keys.Home, preventDefault: sinon.stub() });
			assert.isTrue(onActiveIndexChange.calledWith(0), 'Home key moves to first option');

			h.trigger('@root', 'onkeydown', { which: Keys.End, preventDefault: sinon.stub() });
			assert.isTrue(onActiveIndexChange.calledWith(2), 'End key moves to last option');
		},

		'clicking selects option and moves active index'() {
			const onActiveIndexChange = sinon.stub();
			const onOptionSelect = sinon.stub();
			const h = createHarnessWithCompare(() =>  w(Listbox, {
				activeIndex: 1,
				optionData: testOptions,
				onActiveIndexChange,
				onOptionSelect
			}));

			h.trigger('@option-0', 'onClick', testOptions[0], 0);
			assert.isTrue(onActiveIndexChange.calledWith(0), 'Clicking first option moves active index');
			assert.isTrue(onOptionSelect.calledWith(testOptions[0], 0), 'Clicking first option selects it');
		},

		'keyboard selects active option'() {
			const onOptionSelect = sinon.stub();
			let properties = {
				activeIndex: 1,
				key: 'foo',
				optionData: testOptions,
				onOptionSelect
			};
			const h = createHarnessWithCompare(() =>  w(Listbox, properties));

			h.trigger('@root', 'onkeydown', { which: Keys.Enter, preventDefault: sinon.stub() });
			assert.isTrue(onOptionSelect.calledWith(testOptions[1], 1, 'foo'), 'Enter key selects option');

			properties = {
				activeIndex: 0,
				key: 'foo',
				optionData: testOptions,
				onOptionSelect
			};
			h.trigger('@root', 'onkeydown', { which: Keys.Space, preventDefault: sinon.stub() });
			assert.isTrue(onOptionSelect.calledWith(testOptions[0], 0, 'foo'), 'Space key selects option');
		},

		'disabled options are not selected'() {
			const onOptionSelect = sinon.stub();
			const h = createHarnessWithCompare(() =>  w(Listbox, {
				activeIndex: 2,
				optionData: testOptions,
				getOptionDisabled: (option: any) => !!option.disabled,
				onOptionSelect
			}));

			h.trigger('@root', 'onkeydown', { which: Keys.Enter, preventDefault: sinon.stub() });
			assert.isFalse(onOptionSelect.called, 'Enter key does not select disabled option');

			h.trigger('@root', 'onkeydown', { which: Keys.Space, preventDefault: sinon.stub() });
			assert.isFalse(onOptionSelect.called, 'Space key does not select disabled option');

			h.trigger('@option-0', 'onClick', testOptions[2], 2);
			assert.isFalse(onOptionSelect.called, 'Clicking disabled option does not select it');
		},

		'scroll to active option below the viewport'() {
			const scrollStub = sinon.stub();
			class StubMeta {
				// dimensions .get()
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

				// scroll meta
				public scroll(key: string | number, scrollValue: number) {
					scrollStub(key, scrollValue);
				}
			};
			class ScrollListbox extends Listbox {
				meta(MetaType: any): any {
					return new StubMeta();
				}
			}
			createHarnessWithCompare(() =>  w(ScrollListbox, { activeIndex: 3 }));
			assert.isTrue(scrollStub.calledWith('root', 150));
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

				// scroll meta
				public scroll(key: string | number, scrollValue: number) {
					scrollStub(key, scrollValue);
				}
			};
			class ScrollListbox extends Listbox {
				meta(MetaType: any): any {
					return new StubDimensions();
				}
			}
			createHarnessWithCompare(() =>  w(ScrollListbox, { activeIndex: 0 }));
			assert.isTrue(scrollStub.calledWith('root', 100));
		},

		// Needs JSDOM
		// 'scroll meta'() {
		// 	class TestWidget extends ProjectorMixin(WidgetBase) {
		// 		render() {
		// 			this.meta(ScrollMeta).scroll('root', 100);
		// 			return v('div', {
		// 				key: 'root',
		// 				classes: 'root',
		// 				styles: { height: '200px', 'overflow-y': 'scroll' }
		// 			}, [
		// 				v('div', {
		// 					styles: { height: '400px' }
		// 				})
		// 			]);
		// 		}
		// 	}

		// 	const div = document.createElement('div');
		// 	document.body.appendChild(div);

		// 	const widget = new TestWidget();
		// 	widget.async = false;
		// 	widget.append(div);
		// 	widget.setProperties({
		// 		key: 'root'
		// 	});

		// 	const widgetDiv = document.querySelector('.root');
		// 	assert.strictEqual(widgetDiv!.scrollTop, 100);
		// }
	}
});
