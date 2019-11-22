const { describe, it } = intern.getInterface('bdd');
import { tsx, node } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import createNodeMock from '@dojo/framework/testing/mocks/middleware/node';
import harness from '@dojo/framework/testing/harness';
import Popup from '../index';
import * as fixedCss from '../popup.m.css';

const baseTemplate = assertionTemplate(() => (
	<virtual>
		<span key="trigger" classes={fixedCss.trigger} />
	</virtual>
));

describe('Popup', () => {
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

	it('renders with opacity 1 after height is calculated', () => {
		const mockNode = createNodeMock();

		const wrapper = {
			getBoundingClientRect() {
				return {
					bottom: 0,
					left: 50,
					top: 50,
					right: 0
				};
			},
			boundingDimensions: {
				width: 100,
				height: 100
			}
		};
		mockNode('wrapper', wrapper);

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
					<div key="wrapper" classes={fixedCss.root} styles={{ opacity: '0' }}>
						hello world
					</div>
				</body>
			]);

		h.trigger('@trigger button', 'onclick');

		h.expect(contentTemplate);
	});
});
