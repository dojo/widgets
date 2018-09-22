const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import { v, w } from '@dojo/framework/widget-core/d';
import { stub } from 'sinon';
import {
	compareId,
	createHarness,
	compareAriaDescribedBy,
	noop
} from '../../../../common/tests/support/test-helpers';
import * as fixedCss from '../../../styles/cell.m.css';
import * as css from '../../../../theme/grid-cell.m.css';
import Cell from '../../../widgets/Cell';

const harness = createHarness([ compareId, compareAriaDescribedBy ]);

const expectedEditing = function() {
	return v('div', {
		role: 'cell',
		classes: [css.root, fixedCss.rootFixed]
	}, [
		v('input', {
			key: 'editInput',
			'aria-label': 'Edit id',
			classes: css.input,
			focus: true,
			value: 'id',
			oninput: noop,
			onblur: noop,
			onkeydown: noop
		})
	]);
};

const expectedEditable = function(focusButton = false) {
	return v('div', {
		role: 'cell',
		classes: [css.root, fixedCss.rootFixed]
	}, [
		v('div', {
			key: 'content',
			id: '',
			ondblclick: noop
		}, [ 'id' ]),
		v('button', {
			key: 'editButton',
			focus: focusButton,
			type: 'button',
			'aria-describedby': '',
			classes: css.edit,
			onclick: noop
		}, [ 'Edit' ])
	]);
};

describe('Cell', () => {
	it('should render string value', () => {
		const h = harness(() =>
			w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: noop
			})
		);
		h.expect(() => v('div', {
				classes: [css.root, fixedCss.rootFixed],
				role: 'cell'
			}, [
				v('div', {
					key: 'content',
					id: '',
					ondblclick: noop
				}, [ 'id' ])
			])
		);
	});

	it('should render DNode value', () => {
		const h = harness(() =>
			w(Cell, {
				value: v('div', ['id']),
				rawValue: 'id',
				updater: noop
			})
		);
		h.expect(() => v('div', {
				classes: [css.root, fixedCss.rootFixed],
				role: 'cell'
			}, [
				v('div', {
					key: 'content',
					id: '',
					ondblclick: noop
				}, [ v('div', ['id']) ])
			])
		);
	});

	it('should not allow editing when cell is not editable', () => {
		const updaterStub = stub();
		const h = harness(() =>
			w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: updaterStub
			})
		);
		h.expect(() => v('div', {
				classes: [css.root, fixedCss.rootFixed],
				role: 'cell'
			}, [
				v('div', {
					key: 'content',
					id: '',
					ondblclick: noop
				}, [ 'id' ])
			])
		);

		h.trigger('@content', 'ondblclick');

		h.expect(() => v('div', {
				classes: [css.root, fixedCss.rootFixed],
				role: 'cell'
			}, [
				v('div', {
					key: 'content',
					id: '',
					ondblclick: noop
				}, [ 'id' ])
			])
		);
	});

	it('should allow editing when cell is editable', () => {
		const updaterStub = stub();
		const h = harness(() =>
			w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: updaterStub,
				editable: true
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
				editable: true
			})
		);
		h.expect(expectedEditable);

		h.trigger('@editButton', 'onclick');
		h.expect(expectedEditing);

		h.trigger('@editInput', 'oninput', { target: { value: 'typed value' } });
		h.trigger('@editInput', 'onblur');

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
				editable: true
			})
		);
		h.expect(expectedEditable);

		h.trigger('@content', 'ondblclick');
		h.expect(expectedEditing);

		h.trigger('@editInput', 'oninput', { target: { value: 'typed value' } });
		h.trigger('@editInput', 'onkeydown', { key: 'Enter' });

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
				editable: true
			})
		);
		h.expect(expectedEditable);

		h.trigger('@editButton', 'onclick');
		h.expect(expectedEditing);

		h.trigger('@editInput', 'oninput', { target: { value: 'typed value' } });
		h.trigger('@editInput', 'onkeydown', { key: 'Escape' });

		assert.isFalse(updaterStub.called);
		h.expect(() => expectedEditable(true));
	});
});
