const { describe, it, beforeEach, afterEach } = intern.getInterface('bdd');

import * as sinon from 'sinon';

import { tsx, node } from '@dojo/framework/core/vdom';
import global from '@dojo/framework/shim/global';
import {
	createHarness,
	stubEvent,
	compareResource,
	createTestResource
} from '../../common/tests/support/test-helpers';
import resize from '@dojo/framework/core/middleware/resize';
import { createResizeMock } from '@dojo/framework/testing/mocks/middleware/resize';
import createNodeMock from '@dojo/framework/testing/mocks/middleware/node';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';

import Icon from '../../icon';
import Select from '../../select';

import Pagination from '..';
import * as css from '../../theme/default/pagination.m.css';
import bundle from '../nls/Pagination';

const { messages } = bundle;

const harness = createHarness([compareResource]);

describe('Pagination', () => {
	const noop = () => {};

	const prev = (
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
	);

	const next = (
		<button key="next" type="button" onclick={noop} classes={[css.next, css.link]}>
			<div classes={css.icon}>
				<Icon type="rightIcon" />
			</div>
			<div classes={css.label}>{messages.next}</div>
		</button>
	);

	const makeLinks = (start: number, end?: number) => {
		const links = [];

		if (!end) {
			end = start;
		}

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

	const hiddenAssertion = assertionTemplate(() => (
		<div key="root" classes={[undefined, css.root]}>
			<div key="links" classes={css.linksWrapper} styles={{ opacity: '0' }}>
				{prev}
				<div key="current" classes={css.currentPage}>
					10
				</div>
				{next}
			</div>
		</div>
	));

	const visibleAssertion = assertionTemplate(() => (
		<div key="root" classes={[undefined, css.root]}>
			<div key="links" classes={css.linksWrapper} styles={{ opacity: '1' }}>
				{prev}
				{...makeLinks(1, 9)}
				<div key="current" classes={css.currentPage}>
					10
				</div>
				{...makeLinks(11, 20)}
				{next}
			</div>
		</div>
	));

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

	beforeEach(() => {
		sb.stub(global.window.HTMLDivElement.prototype, 'getBoundingClientRect').callsFake(() => ({
			width: 45
		}));
		nodeMock = createNodeMock();
	});

	afterEach(() => {
		sb.restore();
	});

	it('renders standard use case', () => {
		const h = harness(() => <Pagination total={20} initialPage={10} onPage={noop} />);
		h.expect(hiddenAssertion);
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

			h.expect(hiddenAssertion);
			h.trigger('@prev', 'onclick', stubEvent);

			sinon.assert.calledWith(onPageChange, 9);
		});

		it('raises event from next link', () => {
			const onPageChange = sinon.stub();
			const h = harness(() => (
				<Pagination total={20} initialPage={10} onPage={onPageChange} />
			));

			h.expect(hiddenAssertion);
			h.trigger('@next', 'onclick', stubEvent);

			sinon.assert.calledWith(onPageChange, 11);
		});

		it('raises event from trailing links', () => {
			mockWidth('links', 10000);
			const onPageChange = sinon.stub();
			const h = harness(
				() => <Pagination total={20} initialPage={10} onPage={onPageChange} />,
				{ middleware: [[resize, resizeMock], [node, nodeMock]] }
			);

			h.expect(visibleAssertion);
			h.trigger('@numberedLink-11', 'onclick', stubEvent);

			sinon.assert.calledWith(onPageChange, 11);
		});

		it('raises event from leading links', () => {
			mockWidth('links', 1000);
			const onPageChange = sinon.stub();
			const h = harness(
				() => <Pagination total={20} initialPage={10} onPage={onPageChange} />,
				{ middleware: [[resize, resizeMock], [node, nodeMock]] }
			);

			h.expect(visibleAssertion);
			h.trigger('@numberedLink-9', 'onclick', stubEvent);

			sinon.assert.calledWith(onPageChange, 9);
		});

		it('ignores page change events when controlled', () => {
			mockWidth('links', 1000);
			const onPageChange = sinon.stub();
			const h = harness(() => <Pagination total={20} page={10} onPage={onPageChange} />, {
				middleware: [[resize, resizeMock], [node, nodeMock]]
			});

			h.expect(visibleAssertion);
			h.trigger('@numberedLink-9', 'onclick', stubEvent);
			h.expect(visibleAssertion);
		});
	});

	it('renders without "prev" button when there is no prev', () => {
		mockWidth('links', 1000);
		const h = harness(() => <Pagination total={3} initialPage={1} onPage={noop} />, {
			middleware: [[resize, resizeMock], [node, nodeMock]]
		});

		h.expect(
			assertionTemplate(() => (
				<div key="root" classes={[undefined, css.root]}>
					<div key="links" classes={css.linksWrapper} styles={{ opacity: '1' }}>
						<div key="current" classes={css.currentPage}>
							1
						</div>
						{...makeLinks(2, 3)}
						{next}
					</div>
				</div>
			))
		);
	});

	it('renders without "next" button when there is no next', () => {
		mockWidth('links', 10000);
		const h = harness(() => <Pagination total={3} initialPage={3} onPage={noop} />, {
			middleware: [[resize, resizeMock], [node, nodeMock]]
		});

		h.expect(
			assertionTemplate(() => (
				<div key="root" classes={[undefined, css.root]}>
					<div key="links" classes={css.linksWrapper} styles={{ opacity: '1' }}>
						{prev}
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
		mockWidth('links', 1000);
		const h = harness(
			() => <Pagination total={20} initialPage={10} siblingCount={5} onPage={noop} />,
			{ middleware: [[resize, resizeMock], [node, nodeMock]] }
		);

		h.expect(
			visibleAssertion.replaceChildren('@links', () => [
				prev,
				...makeLinks(5, 9),
				<div key="current" classes={css.currentPage}>
					10
				</div>,
				...makeLinks(11, 15),
				next
			])
		);
	});

	describe('page size selector', () => {
		const sizeSelectorAssertion = visibleAssertion.append(':root', () => [
			<div classes={css.selectWrapper}>
				<Select
					key="page-size-select"
					initialValue="20"
					resource={createTestResource([{ value: '10' }, { value: '20' }], 'value')}
					onValue={noop}
					value={undefined}
				/>
			</div>
		]);
		const pageSizes = [10, 20];

		it('renders', () => {
			mockWidth('links', 1000);
			const h = harness(
				() => (
					<Pagination
						initialPage={10}
						initialPageSize={20}
						total={20}
						onPage={noop}
						pageSizes={pageSizes}
					/>
				),
				{ middleware: [[resize, resizeMock], [node, nodeMock]] }
			);
			h.expect(sizeSelectorAssertion);
		});

		it('raises page-size change events', () => {
			mockWidth('links', 1000);
			const onPageSizeChange = sinon.stub();
			const h = harness(
				() => (
					<Pagination
						initialPage={10}
						initialPageSize={20}
						total={20}
						onPage={noop}
						onPageSize={onPageSizeChange}
						pageSizes={pageSizes}
					/>
				),
				{ middleware: [[resize, resizeMock], [node, nodeMock]] }
			);
			h.expect(sizeSelectorAssertion);

			h.trigger('@page-size-select', 'onValue', { value: '10', label: '10' });
			sinon.assert.calledWith(onPageSizeChange, 10);
		});

		it('passes a value when controlled', () => {
			mockWidth('links', 1000);
			const onPageSizeChange = sinon.stub();
			const h = harness(
				() => (
					<Pagination
						initialPage={10}
						pageSize={20}
						total={20}
						onPage={noop}
						onPageSize={onPageSizeChange}
						pageSizes={pageSizes}
					/>
				),
				{ middleware: [[resize, resizeMock], [node, nodeMock]] }
			);
			h.expect(
				sizeSelectorAssertion
					.setProperty('@page-size-select', 'value', '20')
					.setProperty('@page-size-select', 'initialValue', undefined)
			);

			h.trigger('@page-size-select', 'onValue', { value: '10', label: '10' });
			sinon.assert.calledWith(onPageSizeChange, 10);
		});
	});

	describe('sibling resizing', () => {
		it('limits siblings to siblingCount', () => {
			mockWidth('links', 1000);
			const h = harness(
				() => <Pagination total={20} initialPage={10} siblingCount={3} onPage={noop} />,
				{
					middleware: [[resize, resizeMock], [node, nodeMock]]
				}
			);
			h.expect(
				visibleAssertion.setChildren('@links', () => [
					prev,
					...makeLinks(7, 9),
					<div key="current" classes={css.currentPage}>
						10
					</div>,
					...makeLinks(11, 13),
					next
				])
			);
		});

		it('excludes siblings when insufficient space', () => {
			// available width is 400
			// available width after next/prev/current is 400 - (45*3) = 265
			// leaving room for 265 / 45 = 5.8 => 5 total siblings => 2 siblings on each side
			mockWidth('links', 400);

			const h = harness(() => <Pagination total={20} initialPage={10} onPage={noop} />, {
				middleware: [[resize, resizeMock], [node, nodeMock]]
			});

			h.expect(
				visibleAssertion
					.setProperty('@links', 'styles', {
						opacity: '1'
					})
					.setChildren('@links', () => [
						prev,
						...makeLinks(8, 9),
						<div key="current" classes={css.currentPage}>
							10
						</div>,
						...makeLinks(11, 12),
						next
					])
			);
		});

		it('excludes siblings unevenly when applicable', () => {
			// available width is 400
			// available width after next/prev/current is 400 - (45*3) = 265
			// leaving room for 265 / 45 = 5.8 => 5 total siblings
			// but there's only one leading sibling possible.
			mockWidth('links', 400);

			const h = harness(() => <Pagination total={10} initialPage={2} onPage={noop} />, {
				middleware: [[resize, resizeMock], [node, nodeMock]]
			});

			h.expect(
				visibleAssertion.setChildren('@links', () => [
					prev,
					...makeLinks(1),
					<div key="current" classes={css.currentPage}>
						2
					</div>,
					...makeLinks(3, 6),
					next
				])
			);
		});
	});
});
