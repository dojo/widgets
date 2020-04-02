const { describe, it } = intern.getInterface('bdd');

import * as sinon from 'sinon';

import { tsx } from '@dojo/framework/core/vdom';
import harness from '@dojo/framework/testing/harness';

import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { stubEvent } from '../../common/tests/support/test-helpers';

import Icon from '../../icon';
import Select, { defaultTransform } from '../../select';
import Pagination from '..';
import * as css from '../../theme/default/pagination.m.css';
import bundle from '../Pagination.nls';

const { messages } = bundle;

describe('Pagination', () => {
	const noop = () => {};

	const baseAssertion = assertionTemplate(() => (
		<div key="root" classes={[undefined, css.root]}>
			<button key="prev" type="button" onclick={noop} classes={[css.prev, css.link]}>
				<div classes={css.icon}>
					<Icon type="leftIcon" />
				</div>
				<div classes={css.label}>{messages.previous}</div>
			</button>
			<button
				key="numberedLink-7"
				type="button"
				onclick={noop}
				classes={[css.numberedLink, css.link]}
			>
				7
			</button>
			<button
				key="numberedLink-8"
				type="button"
				onclick={noop}
				classes={[css.numberedLink, css.link]}
			>
				8
			</button>
			<button
				key="numberedLink-9"
				type="button"
				onclick={noop}
				classes={[css.numberedLink, css.link]}
			>
				9
			</button>
			<div classes={css.currentPage}>10</div>
			<button
				key="numberedLink-11"
				type="button"
				onclick={noop}
				classes={[css.numberedLink, css.link]}
			>
				11
			</button>
			<button
				key="numberedLink-12"
				type="button"
				onclick={noop}
				classes={[css.numberedLink, css.link]}
			>
				12
			</button>
			<button
				key="numberedLink-13"
				type="button"
				onclick={noop}
				classes={[css.numberedLink, css.link]}
			>
				13
			</button>
			<button key="next" type="button" onclick={noop} classes={[css.next, css.link]}>
				<div classes={css.icon}>
					<Icon type="rightIcon" />
				</div>
				<div classes={css.label}>{messages.next}</div>
			</button>
		</div>
	));

	it('renders standard use case', () => {
		const h = harness(() => <Pagination total={20} initialPage={10} onPage={noop} />);
		h.expect(baseAssertion);
	});

	it('renders nothing with only 1 page', () => {
		const h = harness(() => <Pagination total={1} onPage={noop} />);
		h.expect(() => false);
	});

	it('raises page change events', () => {
		const onPageChange = sinon.stub();
		const h = harness(() => <Pagination total={20} initialPage={10} onPage={onPageChange} />);

		h.expect(baseAssertion);
		h.trigger('button:first-child', 'onclick', stubEvent);

		sinon.assert.calledWith(onPageChange, 9);
	});

	it('renders without "prev" button when there is no prev', () => {
		const h = harness(() => <Pagination total={3} initialPage={1} onPage={noop} />);
		h.expect(
			assertionTemplate(() => (
				<div key="root" classes={[undefined, css.root]}>
					<div classes={css.currentPage}>1</div>
					<button
						key="numberedLink-2"
						type="button"
						onclick={noop}
						classes={[css.numberedLink, css.link]}
					>
						2
					</button>
					<button
						key="numberedLink-3"
						type="button"
						onclick={noop}
						classes={[css.numberedLink, css.link]}
					>
						3
					</button>
					<button key="next" type="button" onclick={noop} classes={[css.next, css.link]}>
						<div classes={css.icon}>
							<Icon type="rightIcon" />
						</div>
						<div classes={css.label}>Next</div>
					</button>
				</div>
			))
		);
	});

	it('renders without "next" button when there is no next', () => {
		const h = harness(() => <Pagination total={3} initialPage={3} onPage={noop} />);
		h.expect(
			assertionTemplate(() => (
				<div key="root" classes={[undefined, css.root]}>
					<button
						assertion-key="prev"
						key="prev"
						type="button"
						onclick={noop}
						classes={[css.prev, css.link]}
					>
						<div classes={css.icon}>
							<Icon type="leftIcon" />
						</div>
						<div classes={css.label}>Previous</div>
					</button>
					<button
						key="numberedLink-1"
						type="button"
						onclick={noop}
						classes={[css.numberedLink, css.link]}
					>
						1
					</button>
					<button
						key="numberedLink-2"
						type="button"
						onclick={noop}
						classes={[css.numberedLink, css.link]}
					>
						2
					</button>
					<div classes={css.currentPage}>3</div>
				</div>
			))
		);
	});

	it('renders with specified sibling count', () => {
		const h = harness(() => (
			<Pagination total={20} initialPage={10} siblingCount={5} onPage={noop} />
		));
		h.expect(
			baseAssertion
				.insertAfter('@prev', () => [
					<button
						key="numberedLink-5"
						type="button"
						onclick={noop}
						classes={[css.numberedLink, css.link]}
					>
						5
					</button>,
					<button
						key="numberedLink-6"
						type="button"
						onclick={noop}
						classes={[css.numberedLink, css.link]}
					>
						6
					</button>
				])
				.insertBefore('@next', () => [
					<button
						key="numberedLink-14"
						type="button"
						onclick={noop}
						classes={[css.numberedLink, css.link]}
					>
						14
					</button>,
					<button
						key="numberedLink-15"
						type="button"
						onclick={noop}
						classes={[css.numberedLink, css.link]}
					>
						15
					</button>
				])
		);
	});

	describe('PageSizeSelector', () => {
		const sizeSelectorAssertion = baseAssertion.append(':root', [
			<div classes={css.selectWrapper}>
				<Select
					key="page-size-select"
					initialValue="20"
					resource={{
						resource: noop as any,
						data: [{ value: '10' }, { value: '20' }]
					}}
					transform={defaultTransform}
					onValue={noop}
				>
					{noop as any}
				</Select>
			</div>
		]);
		const pageSizes = [10, 20];

		it('renders', () => {
			const h = harness(() => (
				<Pagination
					initialPage={10}
					initialPageSize={20}
					total={20}
					onPage={noop}
					pageSizes={pageSizes}
				/>
			));
			h.expect(sizeSelectorAssertion);
		});

		it('raises page-size change events', () => {
			const onPageSizeChange = sinon.stub();
			const h = harness(() => (
				<Pagination
					initialPage={10}
					initialPageSize={20}
					total={20}
					onPage={noop}
					onPageSize={onPageSizeChange}
					pageSizes={pageSizes}
				/>
			));
			h.expect(sizeSelectorAssertion);

			h.trigger('@page-size-select', 'onValue', '10');
			sinon.assert.calledWith(onPageSizeChange, 10);
		});
	});
});
