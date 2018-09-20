const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import { stub } from 'sinon';
import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';
import TextInput from '../../../../text-input/index';
import Icon from '../../../../icon/index';

import * as css from '../../../widgets/styles/Header.m.css';
import Header from '../../../widgets/Header';

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
				filterer: filtererStub,
				scrollLeft: 0
			})
		);
		h.expect(() =>
			v('div', { scrollLeft: 0, classes: [css.root, null], row: 'rowgroup' }, [
				v('div', { classes: css.row, role: 'row' }, [
					v('div', { classes: css.cell, role: 'columnheader' }, [v('div', {}, ['Title'])]),
					v('div', { classes: css.cell, role: 'columnheader' }, [v('div', {}, ['First Name'])])
				])
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
				filterer: filtererStub,
				scrollLeft: 0
			})
		);

		h.expect(() =>
			v('div', { scrollLeft: 0, classes: [css.root, css.filterGroup], row: 'rowgroup' }, [
				v('div', { classes: css.row, role: 'row' }, [
					v('div', { classes: css.cell, role: 'columnheader' }, [v('div', {}, ['Title'])]),
					v('div', { classes: css.cell, role: 'columnheader' }, [
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
									altText: 'Sort by Custom Title'
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
							onInput: noop
						})
					])
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
				scrollLeft: 0,
				sort: {
					columnId: 'firstName',
					direction: 'asc'
				}
			})
		);

		h.expect(() =>
			v('div', { scrollLeft: 0, classes: [css.root, css.filterGroup], row: 'rowgroup' }, [
				v('div', { classes: css.row, role: 'row' }, [
					v('div', { classes: css.cell, role: 'columnheader' }, [v('div', {}, ['Title'])]),
					v('div', { classes: css.cell, role: 'columnheader' }, [
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
									altText: 'Sort by Custom Title'
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
							onInput: noop
						})
					])
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
				scrollLeft: 0,
				sort: {
					columnId: 'firstName',
					direction: 'desc'
				}
			})
		);

		h.expect(() =>
			v('div', { scrollLeft: 0, classes: [css.root, css.filterGroup], row: 'rowgroup' }, [
				v('div', { classes: css.row, role: 'row' }, [
					v('div', { classes: css.cell, role: 'columnheader' }, [v('div', {}, ['Title'])]),
					v('div', { classes: css.cell, role: 'columnheader' }, [
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
									altText: 'Sort by Custom Title'
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
							onInput: noop
						})
					])
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
				scrollLeft: 0,
				filter: {
					columnId: 'firstName',
					value: 'my filter'
				}
			})
		);

		h.expect(() =>
			v('div', { scrollLeft: 0, classes: [css.root, css.filterGroup], row: 'rowgroup' }, [
				v('div', { classes: css.row, role: 'row' }, [
					v('div', { classes: css.cell, role: 'columnheader' }, [v('div', {}, ['Title'])]),
					v('div', { classes: css.cell, role: 'columnheader' }, [
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
									altText: 'Sort by Custom Title'
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
							onInput: noop
						})
					])
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
				filterer: filtererStub,
				scrollLeft: 0
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
					filterer: filtererStub,
					scrollLeft: 0
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
					scrollLeft: 0,
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
					scrollLeft: 0,
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
	});
});
