const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import TextInput from '../../../text-input/index';
import Button from '../../../button/index';
import Icon from '../../../icon/index';
import { Keys } from '../../../common/util';

import { v, w } from '@dojo/framework/core/vdom';
import { stub } from 'sinon';
import {
	compareId,
	compareAria,
	createHarness,
	compareAriaDescribedBy,
	isFocusedComparator,
	noop
} from '../../../common/tests/support/test-helpers';
import bundle from '../../nls/Grid';
import * as fixedCss from '../../styles/cell.m.css';
import * as css from '../../../theme/default/grid-cell.m.css';
import Cell from '../../Cell';

const { messages } = bundle;

const harness = createHarness([compareId, compareAria, compareAriaDescribedBy]);

const compareInputFocused = {
	selector: '@input',
	property: 'focus',
	comparator: isFocusedComparator
};

const compareButtonFocused = {
	selector: '@button',
	property: 'focus',
	comparator: isFocusedComparator
};

const expectedEditing = function() {
	return v(
		'div',
		{
			role: 'cell',
			styles: { flex: '0 1 100px' },
			classes: [css.root, fixedCss.rootFixed]
		},
		[
			w(
				TextInput,
				{
					key: 'input',
					labelHidden: true,
					classes: { '@dojo/widgets/text-input': { input: [css.input] } },
					focus: noop,
					initialValue: 'id',
					onValue: noop,
					onBlur: noop,
					onKeyDown: noop,
					theme: undefined
				},
				[{ label: 'Edit id' }]
			)
		]
	);
};

const expectedEditable = function() {
	return v(
		'div',
		{
			role: 'cell',
			styles: { flex: '0 1 100px' },
			classes: [css.root, fixedCss.rootFixed]
		},
		[
			v(
				'div',
				{
					key: 'content',
					id: '',
					ondblclick: noop
				},
				['id']
			),
			w(
				Button,
				{
					key: 'button',
					aria: { describedby: '' },
					focus: noop,
					type: 'button',
					onClick: noop,
					classes: { '@dojo/widgets/button': { root: [css.edit] } },
					theme: undefined
				},
				[
					w(Icon, {
						type: 'editIcon',
						altText: messages.edit,
						theme: undefined,
						classes: undefined
					})
				]
			)
		]
	);
};

describe('Cell', () => {
	it('should render string value', () => {
		const h = harness(() =>
			w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: noop,
				width: 100
			})
		);
		h.expect(() =>
			v(
				'div',
				{
					classes: [css.root, fixedCss.rootFixed],
					styles: { flex: '0 1 100px' },
					role: 'cell'
				},
				[
					v(
						'div',
						{
							key: 'content',
							id: '',
							ondblclick: noop
						},
						['id']
					)
				]
			)
		);
	});

	it('should render DNode value', () => {
		const h = harness(() =>
			w(Cell, {
				value: v('div', ['id']),
				rawValue: 'id',
				updater: noop,
				width: 100
			})
		);
		h.expect(() =>
			v(
				'div',
				{
					styles: { flex: '0 1 100px' },
					classes: [css.root, fixedCss.rootFixed],
					role: 'cell'
				},
				[
					v(
						'div',
						{
							key: 'content',
							id: '',
							ondblclick: noop
						},
						[v('div', ['id'])]
					)
				]
			)
		);
	});

	it('should not allow editing when cell is not editable', () => {
		const updaterStub = stub();
		const h = harness(() =>
			w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: updaterStub,
				width: 100
			})
		);
		h.expect(() =>
			v(
				'div',
				{
					classes: [css.root, fixedCss.rootFixed],
					styles: { flex: '0 1 100px' },
					role: 'cell'
				},
				[
					v(
						'div',
						{
							key: 'content',
							id: '',
							ondblclick: noop
						},
						['id']
					)
				]
			)
		);

		h.trigger('@content', 'ondblclick');

		h.expect(() =>
			v(
				'div',
				{
					classes: [css.root, fixedCss.rootFixed],
					styles: { flex: '0 1 100px' },
					role: 'cell'
				},
				[
					v(
						'div',
						{
							key: 'content',
							id: '',
							ondblclick: noop
						},
						['id']
					)
				]
			)
		);
	});

	it('should allow editing when cell is editable', () => {
		const updaterStub = stub();
		const h = harness(() =>
			w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: updaterStub,
				editable: true,
				width: 100
			})
		);
		h.expect(expectedEditable);

		h.trigger('@content', 'ondblclick');

		h.expect(expectedEditing);
	});

	it('should save edit on blur', () => {
		const updaterStub = stub();
		const h = harness(() =>
			w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: updaterStub,
				editable: true,
				width: 100
			})
		);
		h.expect(expectedEditable);

		h.trigger('@button', 'onClick');
		h.expect(expectedEditing);

		h.trigger('@input', 'onValue', 'typed value');
		h.trigger('@input', 'onBlur');

		assert.isTrue(updaterStub.calledWith('typed value'));
		h.expect(expectedEditable);
	});

	it('should save edit on enter', () => {
		const updaterStub = stub();
		const h = harness(() =>
			w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: updaterStub,
				editable: true,
				width: 100
			})
		);
		h.expect(expectedEditable);

		h.trigger('@content', 'ondblclick');
		h.expect(expectedEditing);

		h.trigger('@input', 'onValue', 'typed value');
		h.trigger('@input', 'onKeyDown', Keys.Enter);

		assert.isTrue(updaterStub.calledWith('typed value'));
		h.expect(expectedEditable);
	});

	it('should exit editing without saving on escape', () => {
		const updaterStub = stub();
		const h = harness(() =>
			w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: updaterStub,
				editable: true,
				width: 100
			})
		);
		h.expect(expectedEditable);

		h.trigger('@button', 'onClick');
		h.expect(expectedEditing);

		h.trigger('@input', 'onValue', 'typed value');
		h.trigger('@input', 'onKeyDown', Keys.Escape);

		assert.isFalse(updaterStub.called);
		h.expect(expectedEditable);
	});

	it('should focus input on edit', () => {
		const updaterStub = stub();
		const h = harness(() => {
			return w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: updaterStub,
				editable: true,
				width: 100
			});
		}, [compareInputFocused]);
		h.trigger('@content', 'ondblclick');
		h.expect(expectedEditing);
	});

	it('should focus button on enter and save', () => {
		const updaterStub = stub();
		const h = harness(() => {
			return w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: updaterStub,
				editable: true,
				width: 100
			});
		}, [compareButtonFocused]);

		h.trigger('@content', 'ondblclick');
		h.trigger('@input', 'onValue', 'typed value');
		h.trigger('@input', 'onKeyDown', Keys.Enter);

		assert.isTrue(updaterStub.calledWith('typed value'));
		h.expect(expectedEditable);
	});

	it('should focus button on escape', () => {
		const updaterStub = stub();
		const h = harness(() => {
			return w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: updaterStub,
				editable: true,
				width: 100
			});
		}, [compareButtonFocused]);

		h.trigger('@button', 'onClick');
		h.trigger('@input', 'onKeyDown', Keys.Escape);

		h.expect(expectedEditable);
	});
});
