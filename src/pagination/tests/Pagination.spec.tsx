const { describe, it, before, after } = intern.getInterface('bdd');

import * as sinon from 'sinon';

import { tsx, node } from '@dojo/framework/core/vdom';
import global from '@dojo/framework/shim/global';
import harness from '@dojo/framework/testing/harness';
import resize from '@dojo/framework/core/middleware/resize';
import { createResizeMock } from '@dojo/framework/testing/mocks/middleware/resize';
import createNodeMock from '@dojo/framework/testing/mocks/middleware/node';
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

	const makeLinks = (start: number, end: number) => {
		const links = [];

		for (let i = start; i <= end; i++) {
			links.push(
				<button
					key={`numberedLink-${i}`}
					type="button"
					onclick={noop}
					classes={[css.numberedLink, css.link]}
				>
					{i.toString()}
				</button>
			);
		}

		return links;
	};

	const baseAssertion = assertionTemplate(() => (
		<div key="root" classes={[undefined, css.root]}>
			<div key="links" classes={css.linksWrapper} styles={{ opacity: '0' }}>
				<button key="prev" type="button" onclick={noop} classes={[css.prev, css.link]}>
					<div classes={css.icon}>
						<Icon type="leftIcon" />
					</div>
					<div classes={css.label}>{messages.previous}</div>
				</button>
				{...makeLinks(1, 9)}
				<div key="current" classes={css.currentPage}>
					10
				</div>
				{...makeLinks(11, 20)}
				<button key="next" type="button" onclick={noop} classes={[css.next, css.link]}>
					<div classes={css.icon}>
						<Icon type="rightIcon" />
					</div>
					<div classes={css.label}>{messages.next}</div>
				</button>
			</div>
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

	it('raises page change events', () => {});

	describe('page change events', () => {
		it('raises event from prev link', () => {
			const onPageChange = sinon.stub();
			const h = harness(() => (
				<Pagination total={20} initialPage={10} onPage={onPageChange} />
			));

			h.expect(baseAssertion);
			h.trigger('@prev', 'onclick', stubEvent);

			sinon.assert.calledWith(onPageChange, 9);
		});

		it('raises event from next link', () => {
			const onPageChange = sinon.stub();
			const h = harness(() => (
				<Pagination total={20} initialPage={10} onPage={onPageChange} />
			));

			h.expect(baseAssertion);
			h.trigger('@next', 'onclick', stubEvent);

			sinon.assert.calledWith(onPageChange, 11);
		});

		it('raises event from trailing links', () => {
			const onPageChange = sinon.stub();
			const h = harness(() => (
				<Pagination total={20} initialPage={10} onPage={onPageChange} />
			));

			h.expect(baseAssertion);
			h.trigger('@numberedLink-11', 'onclick', stubEvent);

			sinon.assert.calledWith(onPageChange, 11);
		});

		it('raises event from leading links', () => {
			const onPageChange = sinon.stub();
			const h = harness(() => (
				<Pagination total={20} initialPage={10} onPage={onPageChange} />
			));

			h.expect(baseAssertion);
			h.trigger('@numberedLink-9', 'onclick', stubEvent);

			sinon.assert.calledWith(onPageChange, 9);
		});
	});

	it('renders without "prev" button when there is no prev', () => {
		const h = harness(() => <Pagination total={3} initialPage={1} onPage={noop} />);
		h.expect(
			assertionTemplate(() => (
				<div key="root" classes={[undefined, css.root]}>
					<div key="links" classes={css.linksWrapper} styles={{ opacity: '0' }}>
						<div key="current" classes={css.currentPage}>
							1
						</div>
						{...makeLinks(2, 3)}
						<button
							key="next"
							type="button"
							onclick={noop}
							classes={[css.next, css.link]}
						>
							<div classes={css.icon}>
								<Icon type="rightIcon" />
							</div>
							<div classes={css.label}>Next</div>
						</button>
					</div>
				</div>
			))
		);
	});

	it('renders without "next" button when there is no next', () => {
		const h = harness(() => <Pagination total={3} initialPage={3} onPage={noop} />);
		h.expect(
			assertionTemplate(() => (
				<div key="root" classes={[undefined, css.root]}>
					<div key="links" classes={css.linksWrapper} styles={{ opacity: '0' }}>
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
						{...makeLinks(1, 2)}
						<div key="current" classes={css.currentPage}>
							3
						</div>
					</div>
				</div>
			))
		);
	});

	it('renders with specified sibling count', () => {
		const h = harness(() => (
			<Pagination total={20} initialPage={10} siblingCount={5} onPage={noop} />
		));
		h.expect(
			baseAssertion.replaceChildren('@links', [
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
				</button>,
				...makeLinks(5, 9),
				<div key="current" classes={css.currentPage}>
					10
				</div>,
				...makeLinks(11, 15),
				<button key="next" type="button" onclick={noop} classes={[css.next, css.link]}>
					<div classes={css.icon}>
						<Icon type="rightIcon" />
					</div>
					<div classes={css.label}>Next</div>
				</button>
			])
		);
	});

	describe('page size selector', () => {
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

	describe('sibling resizing', () => {
		const sb = sinon.sandbox.create();
		const resizeMock = createResizeMock();
		let nodeMock: ReturnType<typeof createNodeMock>;

		function mockWidth(key: string, width: number) {
			nodeMock(key, {
				getBoundingClientRect() {
					return {
						width
					};
				}
			});
		}

		before(() => {
			sb.stub(global.window.HTMLDivElement.prototype, 'getBoundingClientRect').callsFake(
				() => ({
					width: 45
				})
			);
			nodeMock = createNodeMock();
		});

		after(() => {
			sb.restore();
		});

		it('re-renders when sizing is available', () => {});

		it('excludes siblings when insufficient space', () => {
			const h = harness(() => <Pagination total={20} initialPage={10} onPage={noop} />, {
				middleware: [[resize, resizeMock], [node, nodeMock]]
			});
			h.expect(baseAssertion);

			// available width is 400
			// available width after next/prev/current is 400 - (45*3) = 265
			// leaving room for 265 / 45 = 5.8 => 5 total siblings => 2 siblings on each side
			mockWidth('links', 400);
			resizeMock(':root', {});

			h.expect(
				baseAssertion
					.setProperty('@links', 'styles', { opacity: '1' })
					.setChildren('@links', [
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
						</button>,
						...makeLinks(8, 9),
						<div key="current" classes={css.currentPage}>
							10
						</div>,
						...makeLinks(11, 12),
						<button
							key="next"
							type="button"
							onclick={noop}
							classes={[css.next, css.link]}
						>
							<div classes={css.icon}>
								<Icon type="rightIcon" />
							</div>
							<div classes={css.label}>Next</div>
						</button>
					])
			);
		});

		it('excludes siblings unevenly when applicable', () => {});
	});
});
