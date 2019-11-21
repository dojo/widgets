const { describe, it, before, after } = intern.getInterface('bdd');
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import global from '@dojo/framework/shim/global';
import Popup from '../index';
import * as fixedCss from '../popup.m.css';
import { sandbox } from 'sinon';

const baseTemplate = assertionTemplate(() => (
	<virtual>
		<span key="trigger" classes={fixedCss.trigger} />
	</virtual>
));

describe('Popup', () => {
	const sb = sandbox.create();

	before(() => {
		sb.stub(global.window.HTMLDivElement.prototype, 'getBoundingClientRect').callsFake(() => ({
			width: 50,
			height: 50,
			bottom: 0,
			top: 0,
			left: 0,
			right: 0
		}));
	});

	after(() => {
		sb.restore();
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

	it('renders with opacity 1 after height is calculated', () => {
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
});
