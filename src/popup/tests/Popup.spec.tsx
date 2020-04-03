const { describe, it, before } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { tsx, node } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import createNodeMock from '@dojo/framework/testing/mocks/middleware/node';
import harness from '@dojo/framework/testing/harness';
import Popup from '../index';
import * as fixedCss from '../popup.m.css';
import * as css from '../../theme/default/popup.m.css';
import { stub } from 'sinon';

const baseTemplate = assertionTemplate(() => (
	<body>
		<div key="underlay" classes={[undefined, fixedCss.underlay, false]} onclick={() => {}} />
		<div key="wrapper" classes={[undefined, fixedCss.root]} styles={{ opacity: '0' }}>
			hello world
		</div>
	</body>
));

describe('Popup', () => {
	before(() => {
		Object.defineProperty(document.documentElement, 'scrollTop', {
			value: 0,
			configurable: true
		});
		Object.defineProperty(document.documentElement, 'clientHeight', {
			value: 1000,
			configurable: true
		});
	});

	it('renders nothing if not open', () => {
		const h = harness(() => (
			<Popup x={0} yTop={0} yBottom={0} onClose={() => {}} open={false}>
				hello world
			</Popup>
		));

		h.expect(assertionTemplate(() => false));
	});

	it('initially renders with opacity 0 while height is calculated', () => {
		const h = harness(() => (
			<Popup x={0} yTop={0} yBottom={0} onClose={() => {}} open={true}>
				hello world
			</Popup>
		));

		h.expect(baseTemplate);
	});

	it('calls onClose when closed', () => {
		const onClose = stub();
		const h = harness(() => (
			<Popup x={0} yTop={0} yBottom={0} open={true} onClose={onClose}>
				hello world
			</Popup>
		));

		h.trigger('@underlay', 'onclick');
		assert.isTrue(onClose.calledOnce);
	});

	it('renders with opacity 1 and matched size / position with dimensions when below', () => {
		const mockNode = createNodeMock();

		const wrapper = {
			getBoundingClientRect() {
				return {
					width: 100,
					height: 100
				};
			}
		};

		mockNode('wrapper', wrapper);

		const h = harness(
			() => (
				<Popup x={50} yTop={100} yBottom={0} open={true} onClose={() => {}}>
					hello world
				</Popup>
			),
			{ middleware: [[node, mockNode]] }
		);
		const contentTemplate = baseTemplate.setChildren(':root', () => [
			<div
				key="underlay"
				classes={[undefined, fixedCss.underlay, false]}
				onclick={() => {}}
			/>,
			<div
				key="wrapper"
				classes={[undefined, fixedCss.root]}
				styles={{ left: '50px', opacity: '1', top: '100px' }}
			>
				hello world
			</div>
		]);

		h.expect(contentTemplate);
	});
	it('renders with opacity 1 and matched size / position with dimensions when it does not fit below', () => {
		const mockNode = createNodeMock();

		const wrapper = {
			getBoundingClientRect() {
				return {
					width: 100,
					height: 100
				};
			}
		};

		mockNode('wrapper', wrapper);

		const h = harness(
			() => (
				<Popup x={50} yTop={901} yBottom={300} open={true} onClose={() => {}}>
					hello world
				</Popup>
			),
			{ middleware: [[node, mockNode]] }
		);
		const contentTemplate = baseTemplate.setChildren(':root', () => [
			<div
				key="underlay"
				classes={[undefined, fixedCss.underlay, false]}
				onclick={() => {}}
			/>,
			<div
				key="wrapper"
				classes={[undefined, fixedCss.root]}
				styles={{ left: '50px', opacity: '1', top: '200px' }}
			>
				hello world
			</div>
		]);

		h.expect(contentTemplate);
	});

	it('renders with opacity 1 and matched size / position with dimensions when it does not fit above', () => {
		const mockNode = createNodeMock();

		const wrapper = {
			getBoundingClientRect() {
				return {
					width: 100,
					height: 100
				};
			}
		};

		mockNode('wrapper', wrapper);

		const h = harness(
			() => (
				<Popup x={50} yTop={300} yBottom={50} open={true} onClose={() => {}}>
					hello world
				</Popup>
			),
			{ middleware: [[node, mockNode]] }
		);
		const contentTemplate = baseTemplate.setChildren(':root', () => [
			<div
				key="underlay"
				classes={[undefined, fixedCss.underlay, false]}
				onclick={() => {}}
			/>,
			<div
				key="wrapper"
				classes={[undefined, fixedCss.root]}
				styles={{ left: '50px', opacity: '1', top: '300px' }}
			>
				hello world
			</div>
		]);

		h.expect(contentTemplate);
	});

	it('Renders with an underlay', () => {
		const h = harness(() => (
			<Popup x={0} yTop={0} yBottom={0} onClose={() => {}} underlayVisible={true} open={true}>
				hello world
			</Popup>
		));

		h.expect(
			baseTemplate.setProperty('@underlay', 'classes', [
				undefined,
				fixedCss.underlay,
				css.underlayVisible
			])
		);
	});
});
