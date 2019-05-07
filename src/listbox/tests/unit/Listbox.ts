const { assert } = intern.getPlugin('chai');
const { registerSuite } = intern.getInterface('object');
import * as sinon from 'sinon';

import { DNode } from '@dojo/framework/widget-core/interfaces';
import { Keys } from '../../../common/util';
import Focus from '@dojo/framework/widget-core/meta/Focus';
import Resize from '@dojo/framework/widget-core/meta/Resize';
import Dimensions from '@dojo/framework/widget-core/meta/Dimensions';
import { v, w } from '@dojo/framework/widget-core/d';

import Listbox from '../../index';
import ListboxOption, { ListboxOptionProperties } from '../../ListboxOption';
import * as css from '../../../theme/listbox.m.css';
import {
	createHarness,
	compareId,
	noop,
	MockMetaMixin,
	stubEvent
} from '../../../common/tests/support/test-helpers';

const compareKey = {
	selector: '*',
	property: 'key',
	comparator: (property: any) => typeof property === 'string'
};
const compareAriaActiveDescendant = {
	selector: '*',
	property: 'aria-activedescendant',
	comparator: (property: any) => typeof property === 'string'
};

const harness = createHarness([compareId, compareAriaActiveDescendant]);

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
	return v('div', { key: 'first', role: 'presentation' }, [
		w(ListboxOption, {
			active: false,
			css: [css.option, css.activeOption, null, null],
			disabled: false,
			id: 'first',
			index: 0,
			key: 'option-0',
			label: '[object Object]',
			option: testOptions[0],
			selected: false,
			onClick: noop,
			theme: undefined,
			classes: undefined,
			...overrides
		})
	]);
};

const expectedSecondOption = (overrides: Partial<ListboxOptionProperties> = {}) => {
	return v('div', { key: '1', role: 'presentation' }, [
		w(ListboxOption, {
			active: false,
			css: [css.option, null, null, null],
			disabled: false,
			id: '',
			index: 1,
			key: 'option-1',
			label: '[object Object]',
			option: testOptions[1],
			selected: false,
			onClick: noop,
			theme: undefined,
			classes: undefined,
			...overrides
		})
	]);
};

const expectedThirdOption = (overrides: Partial<ListboxOptionProperties> = {}) => {
	return v('div', { key: '2', role: 'presentation' }, [
		w(ListboxOption, {
			active: false,
			css: [css.option, null, null, null],
			disabled: false,
			id: '',
			index: 2,
			key: 'option-2',
			label: '[object Object]',
			option: testOptions[2],
			selected: false,
			onClick: noop,
			theme: undefined,
			classes: undefined,
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
	return v(
		'div',
		{
			'aria-activedescendant': '',
			'aria-multiselectable': null,
			classes: [css.root, null],
			id: undefined,
			focus: noop,
			key: 'root',
			role: 'listbox',
			tabIndex: 0,
			onkeydown: noop
		},
		options
	);
};

registerSuite('Listbox', {
	tests: {
		'empty listbox'() {
			const h = harness(() => w(Listbox, {}));
			h.expect(() => expectedVdom());
		},

		'options with default properties'() {
			const h = harness(
				() =>
					w(Listbox, {
						optionData: testOptions
					}),
				[compareKey]
			);
			h.expect(() => expectedVdom(expectedOptions()));
		},

		'custom properties'() {
			const h = harness(() =>
				w(Listbox, {
					activeIndex: 0,
					aria: { describedBy: 'foo' },
					visualFocus: true,
					widgetId: 'bar',
					multiselect: true,
					optionData: testOptions,
					tabIndex: -1,
					theme: {},
					getOptionDisabled: (option: any) => !!option.disabled,
					getOptionId: (option: any, index: number) => option.id || `${index}`,
					getOptionLabel: (option: any) => option.label,
					getOptionSelected: (option: any, index: number) => index === 1
				})
			);

			h.expect(() =>
				v(
					'div',
					{
						'aria-activedescendant': 'first',
						'aria-describedby': 'foo',
						'aria-multiselectable': 'true',
						classes: [css.root, css.focused],
						id: 'bar',
						tabIndex: -1,
						focus: noop,
						key: 'root',
						role: 'listbox',
						onkeydown: noop
					},
					[
						expectedFirstOption({
							label: 'One',
							active: true,
							theme: {}
						}),
						expectedSecondOption({
							css: [css.option, null, null, css.selectedOption],
							label: 'Two',
							selected: true,
							theme: {}
						}),
						expectedThirdOption({
							css: <any>[css.option, null, css.disabledOption, null],
							disabled: true,
							label: 'Three',
							theme: {}
						})
					]
				)
			);
		},

		'focused class'() {
			const mockMeta = sinon.stub();
			const mockFocusGet = sinon.stub().returns({
				active: true,
				containsFocus: true
			});
			mockMeta.withArgs(Focus).returns({
				get: mockFocusGet
			});
			mockMeta.withArgs(Resize).returns({
				get: () => {}
			});
			mockMeta.withArgs(Dimensions).returns({
				get: sinon.stub().returns({
					scroll: {
						height: 0,
						top: 0
					},
					offset: {
						height: 0,
						top: 0
					}
				}),
				has: () => false
			});
			const h = harness(() => w(MockMetaMixin(Listbox, mockMeta), {}));
			h.expect(() =>
				v(
					'div',
					{
						'aria-activedescendant': '',
						'aria-multiselectable': null,
						classes: [css.root, css.focused],
						id: undefined,
						focus: noop,
						key: 'root',
						role: 'listbox',
						tabIndex: 0,
						onkeydown: noop
					},
					[]
				)
			);
		},

		'onkeydown event'() {
			const onKeyDown = sinon.stub();
			const h = harness(() => w(Listbox, { onKeyDown }));
			h.trigger('@root', 'onkeydown', { eventInit: { which: Keys.Down }, ...stubEvent });
			assert.isTrue(onKeyDown.called);
		},

		'arrow keys move active index'() {
			const onActiveIndexChange = sinon.stub();
			const h = harness(() =>
				w(Listbox, {
					optionData: testOptions,
					onActiveIndexChange
				})
			);
			h.trigger('@root', 'onkeydown', {
				which: Keys.Down,
				preventDefault: sinon.stub(),
				...stubEvent
			});
			assert.isTrue(onActiveIndexChange.calledWith(1), 'Down arrow moves to second option');
			h.trigger('@root', 'onkeydown', {
				which: Keys.Up,
				preventDefault: sinon.stub(),
				...stubEvent
			});
			assert.isTrue(onActiveIndexChange.calledWith(1), 'Up arrow moves to last option');
		},

		'home and end move active index'() {
			const onActiveIndexChange = sinon.stub();
			const h = harness(() =>
				w(Listbox, {
					activeIndex: 1,
					optionData: testOptions,
					onActiveIndexChange
				})
			);

			h.trigger('@root', 'onkeydown', {
				which: Keys.Home,
				preventDefault: sinon.stub(),
				...stubEvent
			});
			assert.isTrue(onActiveIndexChange.calledWith(0), 'Home key moves to first option');

			h.trigger('@root', 'onkeydown', {
				which: Keys.End,
				preventDefault: sinon.stub(),
				...stubEvent
			});
			assert.isTrue(onActiveIndexChange.calledWith(2), 'End key moves to last option');
		},

		'clicking selects option and moves active index'() {
			const onActiveIndexChange = sinon.stub();
			const onOptionSelect = sinon.stub();
			const h = harness(() =>
				w(Listbox, {
					activeIndex: 1,
					optionData: testOptions,
					onActiveIndexChange,
					onOptionSelect
				})
			);

			h.trigger('@option-0', 'onClick', testOptions[0], 0);
			assert.isTrue(
				onActiveIndexChange.calledWith(0),
				'Clicking first option moves active index'
			);
			assert.isTrue(
				onOptionSelect.calledWith(testOptions[0], 0),
				'Clicking first option selects it'
			);
		},

		'keyboard selects active option'() {
			const onOptionSelect = sinon.stub();
			let properties = {
				activeIndex: 1,
				key: 'foo',
				optionData: testOptions,
				onOptionSelect
			};
			const h = harness(() => w(Listbox, properties));

			h.trigger('@root', 'onkeydown', {
				which: Keys.Enter,
				preventDefault: sinon.stub(),
				...stubEvent
			});
			assert.isTrue(
				onOptionSelect.calledWith(testOptions[1], 1, 'foo'),
				'Enter key selects option'
			);

			properties = {
				activeIndex: 0,
				key: 'foo',
				optionData: testOptions,
				onOptionSelect
			};
			h.trigger('@root', 'onkeydown', {
				which: Keys.Space,
				preventDefault: sinon.stub(),
				...stubEvent
			});
			assert.isTrue(
				onOptionSelect.calledWith(testOptions[0], 0, 'foo'),
				'Space key selects option'
			);
		},

		'disabled options are not selected'() {
			const onOptionSelect = sinon.stub();
			const h = harness(() =>
				w(Listbox, {
					activeIndex: 2,
					optionData: testOptions,
					getOptionDisabled: (option: any) => !!option.disabled,
					onOptionSelect
				})
			);

			h.trigger('@root', 'onkeydown', {
				which: Keys.Enter,
				preventDefault: sinon.stub(),
				...stubEvent
			});
			assert.isFalse(onOptionSelect.called, 'Enter key does not select disabled option');

			h.trigger('@root', 'onkeydown', {
				which: Keys.Space,
				preventDefault: sinon.stub(),
				...stubEvent
			});
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
					} else {
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
			}
			class ScrollListbox extends Listbox {
				meta(MetaType: any): any {
					return new StubMeta();
				}
			}
			harness(() => w(ScrollListbox, { activeIndex: 3 }));
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
					} else {
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
			}
			class ScrollListbox extends Listbox {
				meta(MetaType: any): any {
					return new StubDimensions();
				}
			}
			harness(() => w(ScrollListbox, { activeIndex: 0 }));
			assert.isTrue(scrollStub.calledWith('root', 100));
		}
	}
});
