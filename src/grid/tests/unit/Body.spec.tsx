const { describe, it, afterEach, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import harness from '@dojo/framework/testing/harness/harness';
import { v, w } from '@dojo/framework/core/vdom';
import global from '@dojo/framework/shim/global';

import * as fixedCss from '../../styles/body.m.css';
import * as css from '../../../theme/default/grid-body.m.css';
import Body from '../../Body';
import PlaceholderRow from '../../PlaceholderRow';
import Row from '../../Row';
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
				columnConfig: [],
				fetcher: noop,
				updater: noop,
				pageChange: noop,
				columnWidths: {}
			})
		);

		let rows: any[] = [];
		for (let i = 0; i < 100; i++) {
			rows.push(w(PlaceholderRow, { key: i, theme: undefined, classes: undefined }));
		}

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [css.root, fixedCss.rootFixed],
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { styles: {} }, [
						v('div', { key: 'top', styles: { height: '0px' } }),
						...rows,
						v('div', { key: 'bottom', styles: { height: '31500px' } })
					])
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
					i18nBundle: undefined,
					item,
					columnConfig: [] as any,
					updater: noop,
					classes: undefined,
					theme: undefined,
					columnWidths: {},
					onRowSelect: undefined,
					selected: false
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
				columnWidths: {}
			})
		);

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [css.root, fixedCss.rootFixed],
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { styles: {} }, [
						v('div', { key: 'top', styles: { height: '0px' } }),
						...rows,
						v('div', { key: 'bottom', styles: { height: '31500px' } })
					])
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
				columnWidths: {}
			})
		);

		let rows: any[] = [];
		for (let i = 0; i < 80; i++) {
			rows.push(w(PlaceholderRow, { key: i, theme: undefined, classes: undefined }));
		}

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [css.root, fixedCss.rootFixed],
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { styles: {} }, [
						v('div', { key: 'top', styles: { height: '0px' } }),
						...rows,
						v('div', { key: 'bottom', styles: { height: '0px' } })
					])
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
					i18nBundle: undefined,
					item,
					columnConfig: [] as any,
					updater: noop,
					classes: undefined,
					theme: undefined,
					columnWidths: {},
					onRowSelect: undefined,
					selected: false
				})
			);
		}

		const fetcherStub = stub();

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
				columnWidths: {}
			})
		);

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [css.root, fixedCss.rootFixed],
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { styles: {} }, [
						v('div', { key: 'top', styles: { height: '0px' } }),
						...rows,
						v('div', { key: 'bottom', styles: { height: '31500px' } })
					])
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
			rows.push(w(PlaceholderRow, { key: i, theme: undefined, classes: undefined }));
		}

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [css.root, fixedCss.rootFixed],
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { styles: {} }, [
						v('div', { key: 'top', styles: { height: '10010px' } }),
						...rows,
						v('div', { key: 'bottom', styles: { height: '23310px' } })
					])
				]
			)
		);

		assert.isTrue(fetcherStub.called);

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [css.root, fixedCss.rootFixed],
					role: 'rowgroup',
					onscroll: noop,
					styles: { height: '400px' }
				},
				[
					v('div', { styles: {} }, [
						v('div', { key: 'top', styles: { height: '10010px' } }),
						...rows,
						v('div', { key: 'bottom', styles: { height: '23310px' } })
					])
				]
			)
		);
	});

	describe('pageChange', () => {
		it('should call pageChange with first page at scroll 0', () => {
			const pageChangeStub = stub();
			const page: any[] = [];
			for (let i = 0; i < 100; i++) {
				const item = { id: 'id' };
				page.push(item);
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
					pageChange: pageChangeStub,
					columnWidths: {}
				})
			);

			h.trigger('@root', 'onscroll', {
				target: {
					scrollTop: 0,
					scrollLeft: 0
				}
			});
			h.expect(() => h.getRender());
			assert.isTrue(pageChangeStub.calledWith(1));
		});

		it('should use middle row if start and end pages are different', () => {
			const pageChangeStub = stub();
			const page: any[] = [];
			for (let i = 0; i < 100; i++) {
				const item = { id: 'id' };
				page.push(item);
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
					pageChange: pageChangeStub,
					columnWidths: {}
				})
			);
			// scroll to row 286
			h.trigger('@root', 'onscroll', {
				target: {
					scrollTop: 10000,
					scrollLeft: 0
				}
			});
			// force a render
			h.expect(() => h.getRender());
			assert.isTrue(pageChangeStub.calledWith(3));
		});

		it('should set the body to the correct width', () => {
			const pageChangeStub = stub();
			const page: any[] = [];
			for (let i = 0; i < 100; i++) {
				const item = { id: 'id' };
				page.push(item);
			}

			const columnConfig = [
				{
					id: 'id',
					title: 'Id'
				}
			];

			const h = harness(() =>
				w(Body, {
					totalRows: 1000,
					pageSize: 100,
					height: 400,
					pages: {},
					columnConfig,
					fetcher: noop,
					updater: noop,
					pageChange: pageChangeStub,
					columnWidths: {
						id: 100
					},
					width: 100
				})
			);

			const rows: any[] = [];
			for (let i = 0; i < 100; i++) {
				rows.push(w(PlaceholderRow, { key: i, theme: undefined, classes: undefined }));
			}

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [css.root, fixedCss.rootFixed],
						role: 'rowgroup',
						onscroll: noop,
						styles: { height: '400px', width: '100px' }
					},
					[
						v('div', { styles: { width: '100px' } }, [
							v('div', { key: 'top', styles: { height: '0px' } }),
							...rows,
							v('div', { key: 'bottom', styles: { height: '31500px' } })
						])
					]
				)
			);
		});

		it('should pass selection details to rows', () => {
			const columnConfig = [
				{
					id: 'id',
					title: 'Id'
				}
			];
			const rows: any[] = [];
			const page: any[] = [];
			for (let i = 0; i < 100; i++) {
				const item = { id: 'id' };
				page.push(item);
				rows.push(
					w(Row, {
						id: i,
						key: i,
						i18nBundle: undefined,
						item,
						columnConfig,
						updater: noop,
						classes: undefined,
						theme: undefined,
						columnWidths: undefined,
						onRowSelect: noop,
						selected: i === 1
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
					columnConfig,
					fetcher: noop,
					updater: noop,
					pageChange: noop,
					onRowSelect: noop,
					selectedRows: [1]
				})
			);

			h.expect(() =>
				v(
					'div',
					{
						key: 'root',
						classes: [css.root, fixedCss.rootFixed],
						role: 'rowgroup',
						onscroll: noop,
						styles: { height: '400px' }
					},
					[
						v('div', { styles: {} }, [
							v('div', { key: 'top', styles: { height: '0px' } }),
							...rows,
							v('div', { key: 'bottom', styles: { height: '31500px' } })
						])
					]
				)
			);
		});
	});
});
