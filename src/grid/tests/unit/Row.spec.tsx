const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/core/vdom';
import { stub } from 'sinon';
import Row from '../../Row';

import defaultBundle from '../../nls/Grid';
import * as fixedCss from './../../styles/row.m.css';
import * as css from '../../../theme/default/grid-row.m.css';
import { ColumnConfig } from '../../interfaces';
import Cell from '../../Cell';

const noop = () => {};

describe('Row', () => {
	it('should render without columns', () => {
		const h = harness(() =>
			w(Row, { id: 1, item: {}, columnConfig: [] as any, updater: noop, columnWidths: {} })
		);
		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [css.root, undefined, fixedCss.rootFixed, undefined],
					role: 'row',
					'aria-rowindex': '2',
					onclick: undefined
				},
				[]
			)
		);
	});

	it('should render items for column config', () => {
		const columnConfig: ColumnConfig = {
			id: 'id',
			title: 'id'
		};
		const h = harness(() =>
			w(Row, {
				id: 1,
				item: { id: 'id' },
				columnConfig: [columnConfig],
				updater: noop,
				columnWidths: { id: 100 }
			})
		);
		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [css.root, undefined, fixedCss.rootFixed, undefined],
					role: 'row',
					'aria-rowindex': '2',
					onclick: undefined
				},
				[
					w(Cell, {
						bundle: undefined,
						key: 'id',
						updater: noop,
						value: 'id',
						editable: undefined,
						rawValue: 'id',
						classes: undefined,
						theme: undefined,
						width: 100
					})
				]
			)
		);
	});

	it('should call custom renderer with item value for column config', () => {
		const columnConfig: ColumnConfig = {
			id: 'id',
			title: 'id',
			renderer: () => 'transformed'
		};
		const h = harness(() =>
			w(Row, {
				id: 1,
				item: { id: 'id' },
				columnConfig: [columnConfig],
				updater: noop,
				columnWidths: { id: 100 }
			})
		);
		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [css.root, undefined, fixedCss.rootFixed, undefined],
					role: 'row',
					'aria-rowindex': '2',
					onclick: undefined
				},
				[
					w(Cell, {
						bundle: undefined,
						key: 'id',
						updater: noop,
						value: 'transformed',
						editable: undefined,
						rawValue: 'id',
						classes: undefined,
						theme: undefined,
						width: 100
					})
				]
			)
		);
	});

	it('should set row as selected and call row select on click', () => {
		const rowSelectStub = stub();
		const columnConfig: ColumnConfig = {
			id: 'id',
			title: 'id',
			renderer: () => 'transformed'
		};
		const h = harness(() =>
			w(Row, {
				id: 1,
				item: { id: 'id' },
				columnConfig: [columnConfig],
				updater: noop,
				columnWidths: { id: 100 },
				selected: true,
				onRowSelect: rowSelectStub
			})
		);

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [css.root, css.selected, fixedCss.rootFixed, css.selectable],
					role: 'row',
					'aria-rowindex': '2',
					onclick: noop
				},
				[
					w(Cell, {
						bundle: undefined,
						key: 'id',
						updater: noop,
						value: 'transformed',
						editable: undefined,
						rawValue: 'id',
						classes: undefined,
						theme: undefined,
						width: 100
					})
				]
			)
		);

		h.trigger('@root', 'onclick', { ctrlKey: true });
		assert.isTrue(rowSelectStub.calledOnce);
		assert.isTrue(rowSelectStub.firstCall.calledWith('multi'));
		h.trigger('@root', 'onclick', { metaKey: true });
		assert.isTrue(rowSelectStub.calledTwice);
		assert.isTrue(rowSelectStub.secondCall.calledWith('multi'));
		h.trigger('@root', 'onclick', {});
		assert.isTrue(rowSelectStub.calledThrice);
		assert.isTrue(rowSelectStub.thirdCall.calledWith('single'));
	});

	it('should render with a custom message bundle', () => {
		const bundle = { messages: { ...defaultBundle.messages } };
		const columnConfig: ColumnConfig = {
			id: 'id',
			title: 'id'
		};
		const h = harness(() =>
			w(Row, {
				bundle,
				id: 1,
				item: { id: 'id' },
				columnConfig: [columnConfig],
				updater: noop,
				columnWidths: { id: 100 }
			})
		);
		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [css.root, undefined, fixedCss.rootFixed, undefined],
					role: 'row',
					'aria-rowindex': '2',
					onclick: undefined
				},
				[
					w(Cell, {
						bundle,
						key: 'id',
						updater: noop,
						value: 'id',
						editable: undefined,
						rawValue: 'id',
						classes: undefined,
						theme: undefined,
						width: 100
					})
				]
			)
		);
	});
});
