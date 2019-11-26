const { describe, it, before } = intern.getInterface('bdd');
import { tsx, node } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import createNodeMock from '@dojo/framework/testing/mocks/middleware/node';
import harness from '@dojo/framework/testing/harness';
import Popup from '../index';
import * as fixedCss from '../popup.m.css';
import * as css from '../../theme/popup.m.css';

const baseTemplate = assertionTemplate(() => (
	<virtual>
		<span key="trigger" classes={fixedCss.trigger} />
	</virtual>
));

describe('Popup', () => {
	before(() => {
		Object.defineProperty(document.documentElement, 'scrollTop', { value: 0 });
		Object.defineProperty(document.documentElement, 'clientHeight', { value: 1000 });
	});

	it('Renders with trigger renderer', () => {
		const h = harness(() => (
			<Popup>
				{{
					trigger: (onToggleOpen) => <button onclick={onToggleOpen} />,
					content: () => 'hello world'
				}}
			</Popup>
		));
		const triggerTemplate = baseTemplate.setChildren('@trigger', () => [
			<button onclick={() => {}} />
		]);
		h.expect(triggerTemplate);
	});

	it('initialy renders with opacity 0 while height is calculated', () => {
		const h = harness(() => (
			<Popup>
				{{
					trigger: (onToggleOpen) => <button onclick={onToggleOpen} />,
					content: () => 'hello world'
				}}
			</Popup>
		));
		const contentTemplate = baseTemplate
			.setChildren('@trigger', () => [<button onclick={() => {}} />])
			.insertSiblings('@trigger', () => [
				<body>
					<div key="underlay" classes={[fixedCss.underlay, false]} onclick={() => {}} />
					<div key="wrapper" classes={fixedCss.root} styles={{ opacity: '0' }}>
						hello world
					</div>
				</body>
			]);

		h.trigger('@trigger button', 'onclick');
		h.expect(contentTemplate);
	});

	it('renders with opacity 1 and matched size / position with dimensions', () => {
		const mockNode = createNodeMock();

		const wrapper = {
			getBoundingClientRect() {
				return {
					width: 100,
					height: 100
				};
			}
		};

		const trigger = {
			getBoundingClientRect() {
				return {
					bottom: 0,
					left: 50,
					top: 50,
					right: 0,
					width: 150,
					height: 50
				};
			}
		};

		mockNode('wrapper', wrapper);
		mockNode('trigger', trigger);

		const h = harness(
			() => (
				<Popup>
					{{
						trigger: (onToggleOpen) => <button onclick={onToggleOpen} />,
						content: () => 'hello world'
					}}
				</Popup>
			),
			{ middleware: [[node, mockNode]] }
		);
		const contentTemplate = baseTemplate
			.setChildren('@trigger', () => [<button onclick={() => {}} />])
			.insertSiblings('@trigger', () => [
				<body>
					<div key="underlay" classes={[fixedCss.underlay, false]} onclick={() => {}} />
					<div
						key="wrapper"
						classes={fixedCss.root}
						styles={{ width: '150px', left: '50px', opacity: '1', top: '100px' }}
					>
						hello world
					</div>
				</body>
			]);

		h.trigger('@trigger button', 'onclick');

		h.expect(contentTemplate);
	});

	it('Renders with an underlay', () => {
		const h = harness(() => (
			<Popup underlayVisible>
				{{
					trigger: (onToggleOpen) => <button onclick={onToggleOpen} />,
					content: () => 'hello world'
				}}
			</Popup>
		));
		const underlayTemplate = baseTemplate
			.setChildren('@trigger', () => [<button onclick={() => {}} />])
			.insertSiblings('@trigger', () => [
				<body>
					<div
						key="underlay"
						classes={[fixedCss.underlay, css.underlayVisible]}
						onclick={() => {}}
					/>
					<div key="wrapper" classes={fixedCss.root} styles={{ opacity: '0' }}>
						hello world
					</div>
				</body>
			]);

		h.trigger('@trigger button', 'onclick');
		h.expect(underlayTemplate);
	});
});
