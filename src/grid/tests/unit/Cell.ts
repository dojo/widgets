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
import * as fixedCss from '../../styles/cell.m.css';
import * as css from '../../../theme/grid-cell.m.css';
import Cell from '../../Cell';

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
			w(TextInput, {
				key: 'input',
				label: 'Edit id',
				labelHidden: true,
				extraClasses: { input: css.input },
				focus: noop,
				value: 'id',
				onInput: noop,
				onBlur: noop,
				onKeyDown: noop,
				classes: undefined,
				theme: undefined
			})
		]
	);
};

const expectedEditable = function(focusButton = false) {
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
					extraClasses: { root: css.edit },
					onClick: noop,
					classes: undefined,
					theme: undefined
				},
				[
					w(Icon, {
						type: 'editIcon',
						altText: 'Edit',
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

		h.trigger('@input', 'onInput', 'typed value');
		h.trigger('@input', 'onBlur');

		assert.isTrue(updaterStub.calledWith('typed value'));
		h.expect(() => expectedEditable(true));
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

		h.trigger('@input', 'onInput', 'typed value');
		h.trigger('@input', 'onKeyDown', Keys.Enter);

		assert.isTrue(updaterStub.calledWith('typed value'));
		h.expect(() => expectedEditable(true));
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

		h.trigger('@input', 'onInput', 'typed value');
		h.trigger('@input', 'onKeyDown', Keys.Escape);

		assert.isFalse(updaterStub.called);
		h.expect(() => expectedEditable(true));
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
		h.trigger('@input', 'onInput', 'typed value');
		h.trigger('@input', 'onKeyDown', Keys.Enter);

		assert.isTrue(updaterStub.calledWith('typed value'));
		h.expect(() => expectedEditable(true));
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

		h.expect(() => expectedEditable(true));
	});
});
