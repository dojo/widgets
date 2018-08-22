const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';
import { stub } from 'sinon';

import * as css from '../../../widgets/styles/Cell.m.css';
import Cell from '../../../widgets/Cell';

const noop = () => {};

describe('Cell', () => {
	it('should render string value', () => {
		const h = harness(() =>
			w(Cell, {
				value: 'id',
				rawValue: 'id',
				updater: noop
			})
		);
		h.expect(() =>
			v(
				'div',
				{
					classes: css.root,
					key: 'cell',
					role: 'cell',
					ondblclick: noop
				},
				['id']
			)
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
		h.expect(() =>
			v(
				'div',
				{
					key: 'cell',
					classes: css.root,
					role: 'cell',
					ondblclick: noop
				},
				[v('div', ['id'])]
			)
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
		h.expect(() =>
			v(
				'div',
				{
					key: 'cell',
					classes: css.root,
					role: 'cell',
					ondblclick: noop
				},
				['id']
			)
		);

		h.trigger('@cell', 'ondblclick');

		h.expect(() =>
			v(
				'div',
				{
					key: 'cell',
					classes: css.root,
					role: 'cell',
					ondblclick: noop
				},
				['id']
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
				editable: true
			})
		);
		h.expect(() =>
			v(
				'div',
				{
					key: 'cell',
					classes: css.root,
					role: 'cell',
					ondblclick: noop
				},
				['id']
			)
		);

		h.trigger('@cell', 'ondblclick');

		h.expect(() =>
			v('input', {
				key: 'editing',
				classes: [css.root, css.input],
				focus: true,
				value: 'id',
				oninput: noop,
				onblur: noop,
				onkeyup: noop
			})
		);

		h.trigger('@editing', 'oninput', { target: { value: 'typed value' } });

		h.expect(() =>
			v('input', {
				key: 'editing',
				classes: [css.root, css.input],
				focus: true,
				value: 'typed value',
				oninput: noop,
				onblur: noop,
				onkeyup: noop
			})
		);
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
		h.expect(() =>
			v(
				'div',
				{
					key: 'cell',
					classes: css.root,
					role: 'cell',
					ondblclick: noop
				},
				['id']
			)
		);

		h.trigger('@cell', 'ondblclick');

		h.expect(() =>
			v('input', {
				key: 'editing',
				classes: [css.root, css.input],
				focus: true,
				value: 'id',
				oninput: noop,
				onblur: noop,
				onkeyup: noop
			})
		);

		h.trigger('@editing', 'oninput', { target: { value: 'typed value' } });

		h.expect(() =>
			v('input', {
				key: 'editing',
				classes: [css.root, css.input],
				focus: true,
				value: 'typed value',
				oninput: noop,
				onblur: noop,
				onkeyup: noop
			})
		);

		h.trigger('@editing', 'onblur');

		assert.isTrue(updaterStub.called);

		h.expect(() =>
			v(
				'div',
				{
					key: 'cell',
					classes: css.root,
					role: 'cell',
					ondblclick: noop
				},
				['id']
			)
		);
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
		h.expect(() =>
			v(
				'div',
				{
					key: 'cell',
					classes: css.root,
					role: 'cell',
					ondblclick: noop
				},
				['id']
			)
		);

		h.trigger('@cell', 'ondblclick');

		h.expect(() =>
			v('input', {
				key: 'editing',
				classes: [css.root, css.input],
				focus: true,
				value: 'id',
				oninput: noop,
				onblur: noop,
				onkeyup: noop
			})
		);

		h.trigger('@editing', 'oninput', { target: { value: 'typed value' } });

		h.expect(() =>
			v('input', {
				key: 'editing',
				classes: [css.root, css.input],
				focus: true,
				value: 'typed value',
				oninput: noop,
				onblur: noop,
				onkeyup: noop
			})
		);

		h.trigger('@editing', 'onkeyup', { key: 'Enter' });

		assert.isTrue(updaterStub.called);

		h.expect(() =>
			v(
				'div',
				{
					key: 'cell',
					classes: css.root,
					role: 'cell',
					ondblclick: noop
				},
				['id']
			)
		);
	});
});
