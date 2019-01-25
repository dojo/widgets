const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import { stub } from 'sinon';
import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';
import TextInput from '../../../../text-input/index';
import Icon from '../../../../icon/index';

import * as css from '../../../../theme/grid-header.m.css';
import * as fixedCss from '../../../styles/header.m.css';
import Header from '../../../widgets/Header';
import { ColumnConfig } from '../../../interfaces';

const noop = () => {};

const columnConfig = [
	{
		id: 'title',
		title: 'Title'
	},
	{
		id: 'firstName',
		title: 'First Name'
	}
];

const advancedColumnConfig = [
	{
		id: 'title',
		title: 'Title'
	},
	{
		id: 'firstName',
		title: () => 'Custom Title',
		sortable: true,
		editable: true,
		filterable: true
	}
];

describe('Header', () => {
	it('should render basic header', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig,
				sorter: sorterStub,
				filterer: filtererStub
			})
		);
		h.expect(() =>
			v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row' }, [
				v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [v('div', {}, ['Title'])]),
				v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [v('div', {}, ['First Name'])])
			])
		);
	});

	it('should render advanced header', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig: advancedColumnConfig,
				sorter: sorterStub,
				filterer: filtererStub
			})
		);

		h.expect(() =>
			v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row' }, [
				v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [v('div', {}, ['Title'])]),
				v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [
					v('div', {
						classes: [css.sortable, null, null, null],
						onclick: noop
					}, [
						'Custom Title',
						v('button', {
							classes: css.sort,
							onclick: noop
						}, [
							w(Icon, {
								type: 'downIcon',
								altText: 'Sort by Custom Title',
								classes: undefined,
								theme: undefined
							})
						])
					]),
					w(TextInput, {
						key: 'filter',
						extraClasses: { root: css.filter },
						label: 'Filter by Custom Title',
						labelHidden: true,
						type: 'search',
						value: '',
						onInput: noop,
						classes: undefined,
						theme: undefined
					})
				])
			])
		);
	});

	it('should render with asc sorted header', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig: advancedColumnConfig,
				sorter: sorterStub,
				filterer: filtererStub,
				sort: {
					columnId: 'firstName',
					direction: 'asc'
				}
			})
		);

		h.expect(() =>
			v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row' }, [
				v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [v('div', {}, ['Title'])]),
				v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': 'ascending' }, [
					v('div', {
						classes: [css.sortable, css.sorted, null, css.asc],
						onclick: noop
					}, [
						'Custom Title',
						v('button', {
							classes: css.sort,
							onclick: noop
						}, [
							w(Icon, {
								type: 'upIcon',
								altText: 'Sort by Custom Title',
								classes: undefined,
								theme: undefined
							})
						])
					]),
					w(TextInput, {
						key: 'filter',
						extraClasses: { root: css.filter },
						label: 'Filter by Custom Title',
						labelHidden: true,
						type: 'search',
						value: '',
						onInput: noop,
						classes: undefined,
						theme: undefined
					})
				])
			])
		);
	});

	it('should render with desc sorted header', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig: advancedColumnConfig,
				sorter: sorterStub,
				filterer: filtererStub,
				sort: {
					columnId: 'firstName',
					direction: 'desc'
				}
			})
		);

		h.expect(() =>
			v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row' }, [
				v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [v('div', {}, ['Title'])]),
				v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': 'descending' }, [
					v('div', {
						classes: [css.sortable, css.sorted, css.desc, null],
						onclick: noop
					}, [
						'Custom Title',
						v('button', {
							classes: css.sort,
							onclick: noop
						}, [
							w(Icon, {
								type: 'downIcon',
								altText: 'Sort by Custom Title',
								classes: undefined,
								theme: undefined
							})
						])
					]),
					w(TextInput, {
						key: 'filter',
						extraClasses: { root: css.filter },
						label: 'Filter by Custom Title',
						labelHidden: true,
						type: 'search',
						value: '',
						onInput: noop,
						classes: undefined,
						theme: undefined
					})
				])
			])
		);
	});

	it('should render with filter value', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig: advancedColumnConfig,
				sorter: sorterStub,
				filterer: filtererStub,
				filter: {
					firstName: 'my filter'
				}
			})
		);

		h.expect(() =>
			v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row' }, [
				v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [v('div', {}, ['Title'])]),
				v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [
					v('div', {
						classes: [css.sortable, null, null, null],
						onclick: noop
					}, [
						'Custom Title',
						v('button', {
							classes: css.sort,
							onclick: noop
						}, [
							w(Icon, {
								type: 'downIcon',
								altText: 'Sort by Custom Title',
								classes: undefined,
								theme: undefined
							})
						])
					]),
					w(TextInput, {
						key: 'filter',
						extraClasses: { root: css.filter },
						label: 'Filter by Custom Title',
						labelHidden: true,
						type: 'search',
						value: 'my filter',
						onInput: noop,
						classes: undefined,
						theme: undefined
					})
				])
			])
		);
	});

	it('should call filterer on input', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig: advancedColumnConfig,
				sorter: sorterStub,
				filterer: filtererStub
			})
		);

		h.trigger('@filter', 'onInput', 'trillian');
		assert.isTrue(filtererStub.calledWith('firstName', 'trillian'));
	});

	describe('sort interaction', () => {
		it('should sort desc by default', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub
				})
			);

			h.trigger(`.${css.sort}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'desc'));
			sorterStub.reset();

			h.trigger(`.${css.sortable}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'desc'));
		});

		it('should sort asc on if currently desc', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub,
					sort: {
						columnId: 'firstName',
						direction: 'desc'
					}
				})
			);

			h.trigger(`.${css.sort}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'asc'));
			sorterStub.reset();

			h.trigger(`.${css.sortable}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'asc'));
		});

		it('should sort desc on if currently asc', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub,
					sort: {
						columnId: 'firstName',
						direction: 'asc'
					}
				})
			);

			h.trigger(`.${css.sort}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'desc'));
			sorterStub.reset();

			h.trigger(`.${css.sortable}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'desc'));
		});

		it('should use a custom sort renderer for asc', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub,
					sort: {
						columnId: 'firstName',
						direction: 'asc'
					},
					sortRenderer: (column: ColumnConfig, direction: any, sorter: () => void) => {
						const title = typeof column.title === 'string' ? column.title : column.title();
						return v('div', { key: 'sort', onclick: sorter }, [`custom renderer - ${direction} - ${title}`]);
					}
				})
			);

			h.expect(() =>
				v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row' }, [
					v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [v('div', {}, ['Title'])]),
					v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': 'ascending' }, [
						v('div', {
							classes: [css.sortable, css.sorted, null, css.asc],
							onclick: noop
						}, [
							'Custom Title',
							v('div', { key: 'sort', onclick: noop }, ['custom renderer - asc - Custom Title'])
						]),
						w(TextInput, {
							key: 'filter',
							extraClasses: { root: css.filter },
							label: 'Filter by Custom Title',
							labelHidden: true,
							type: 'search',
							value: '',
							onInput: noop,
							classes: undefined,
							theme: undefined
						})
					])
				])
			);
		});

		it('should use a custom sort renderer for desc', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub,
					sort: {
						columnId: 'firstName',
						direction: 'desc'
					},
					sortRenderer: (column: ColumnConfig, direction: any, sorter: () => void) => {
						const title = typeof column.title === 'string' ? column.title : column.title();
						return v('div', { key: 'sort', onclick: sorter }, [`custom renderer - ${direction} - ${title}`]);
					}
				})
			);

			h.expect(() =>
				v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row' }, [
					v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [v('div', {}, ['Title'])]),
					v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': 'descending' }, [
						v('div', {
							classes: [css.sortable, css.sorted, css.desc, null],
							onclick: noop
						}, [
							'Custom Title',
							v('div', { key: 'sort', onclick: noop }, ['custom renderer - desc - Custom Title'])
						]),
						w(TextInput, {
							key: 'filter',
							extraClasses: { root: css.filter },
							label: 'Filter by Custom Title',
							labelHidden: true,
							type: 'search',
							value: '',
							onInput: noop,
							classes: undefined,
							theme: undefined
						})
					])
				])
			);
		});

		it('should use custom filter renderer', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub,
					filterRenderer: (filterValue: string, doFilter: Function, title?: any) => {
						return v('div', [
							v('input', { value: filterValue, onInput: doFilter }),
							v('span', [ title ])
						]);
					}
				})
			);

			h.expect(() =>
				v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row' }, [
					v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [v('div', {}, ['Title'])]),
					v('div', { classes: [css.cell, fixedCss.cellFixed], role: 'columnheader', 'aria-sort': null }, [
						v('div', {
							classes: [css.sortable, null, null, null],
							onclick: noop
						}, [
							'Custom Title',
							v('button', {
								classes: css.sort,
								onclick: noop
							}, [
								w(Icon, {
									type: 'downIcon',
									altText: 'Sort by Custom Title',
									classes: undefined,
									theme: undefined
								})
							])
						]),
						v('div', [
							v('input', { value: '', onInput: noop }),
							v('span', [ 'Custom Title' ])
						])
					])
				])
			);

		});
	});
});
