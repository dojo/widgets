const { describe, it, afterEach, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';
import global from '@dojo/framework/shim/global';

import * as css from '../../../widgets/styles/Body.m.css';
import Body from '../../../widgets/Body';
import PlaceholderRow from '../../../widgets/PlaceholderRow';
import Row from '../../../widgets/Row';
import { stub } from 'sinon';

const noop = () => {};

describe('Body', () => {
	afterEach(() => {
		global.window.HTMLDivElement.prototype.getBoundingClientRect = () => {
			return {
				width: 0,
				height: 0,
				bottom: 0,
				top: 0,
				left: 0,
				right: 0
			};
		};
	});

	beforeEach(() => {
		global.window.HTMLDivElement.prototype.getBoundingClientRect = () => {
			return {
				width: 0,
				height: 35,
				bottom: 0,
				top: 0,
				left: 0,
				right: 0
			};
		};
	});

	it('should render with placeholders', () => {
		const h = harness(() =>
			w(Body, {
				totalRows: 1000,
				pageSize: 100,
				height: 400,
				pages: {},
				columnConfig: [] as any,
				fetcher: noop,
				updater: noop,
				pageChange: noop,
				onScroll: noop
			})
		);

		let rows: any[] = [];
		for (let i = 0; i < 100; i++) {
			rows.push(w(PlaceholderRow, { key: i }));
		}

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: css.root,
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { key: 'top', styles: { height: '0px' } }),
					...rows,
					v('div', { key: 'bottom', styles: { height: '31500px' } })
				]
			)
		);
	});

	it('should render with rows', () => {
		const rows: any[] = [];
		const page: any[] = [];
		for (let i = 0; i < 100; i++) {
			const item = { id: 'id' };
			page.push(item);
			rows.push(
				w(Row, {
					id: i,
					key: i,
					item,
					columnConfig: [] as any,
					updater: noop
				})
			);
		}

		const h = harness(() =>
			w(Body, {
				totalRows: 1000,
				pageSize: 100,
				height: 400,
				pages: {
					'page-1': page
				},
				columnConfig: [] as any,
				fetcher: noop,
				updater: noop,
				pageChange: noop,
				onScroll: noop
			})
		);

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: css.root,
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { key: 'top', styles: { height: '0px' } }),
					...rows,
					v('div', { key: 'bottom', styles: { height: '31500px' } })
				]
			)
		);
	});

	it('should not render placeholders over the total length ', () => {
		const h = harness(() =>
			w(Body, {
				totalRows: 80,
				pageSize: 100,
				height: 400,
				pages: {},
				columnConfig: [] as any,
				fetcher: noop,
				updater: noop,
				pageChange: noop,
				onScroll: noop
			})
		);

		let rows: any[] = [];
		for (let i = 0; i < 80; i++) {
			rows.push(w(PlaceholderRow, { key: i }));
		}

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: css.root,
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { key: 'top', styles: { height: '0px' } }),
					...rows,
					v('div', { key: 'bottom', styles: { height: '0px' } })
				]
			)
		);
	});

	it('should fetch new pages on scroll', () => {
		let rows: any[] = [];
		const page: any[] = [];
		for (let i = 0; i < 100; i++) {
			const item = { id: 'id' };
			page.push(item);
			rows.push(
				w(Row, {
					id: i,
					key: i,
					item,
					columnConfig: [] as any,
					updater: noop
				})
			);
		}

		const fetcherStub = stub();
		const onScrollStub = stub();

		const h = harness(() =>
			w(Body, {
				totalRows: 1000,
				pageSize: 100,
				height: 400,
				pages: {
					'page-1': page
				},
				columnConfig: [] as any,
				fetcher: fetcherStub,
				updater: noop,
				pageChange: noop,
				onScroll: onScrollStub
			})
		);

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: css.root,
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { key: 'top', styles: { height: '0px' } }),
					...rows,
					v('div', { key: 'bottom', styles: { height: '31500px' } })
				]
			)
		);

		h.trigger('@root', 'onscroll', {
			target: {
				scrollTop: 10000,
				scrollLeft: 0
			}
		});

		rows = [];
		for (let i = 286; i < 334; i++) {
			rows.push(w(PlaceholderRow, { key: i }));
		}

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: css.root,
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { key: 'top', styles: { height: '10010px' } }),
					...rows,
					v('div', { key: 'bottom', styles: { height: '23310px' } })
				]
			)
		);

		assert.isTrue(fetcherStub.called);
		assert.isTrue(onScrollStub.called);

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: css.root,
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { key: 'top', styles: { height: '10010px' } }),
					...rows,
					v('div', { key: 'bottom', styles: { height: '23310px' } })
				]
			)
		);
	});
});
