import { sandbox } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import * as css from '../../theme/default/list-box-item.m.css';
import ListBoxItem from '../ListBoxItem';
const { describe, it, after } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

const noop: any = () => {};

describe('ListBoxItem', () => {
	const template = assertionTemplate(() => (
		<div
			key="root"
			onpointermove={noop}
			classes={[css.root, false, false, false]}
			onpointerdown={noop}
			role="option"
			aria-selected={false}
			aria-disabled={false}
			id="test"
		>
			test
		</div>
	));

	const sb = sandbox.create();

	after(() => {
		sb.restore();
	});

	it('renders with a label', () => {
		const h = harness(() => (
			<ListBoxItem widgetId="test" onRequestActive={noop} onSelect={noop}>
				test
			</ListBoxItem>
		));
		h.expect(template);
	});

	it('renders selected', () => {
		const h = harness(() => (
			<ListBoxItem widgetId="test" selected onRequestActive={noop} onSelect={noop}>
				test
			</ListBoxItem>
		));
		const selectedTemplate = template
			.setProperty('@root', 'classes', [css.root, css.selected, false, false])
			.setProperty('@root', 'aria-selected', true);
		h.expect(selectedTemplate);
	});

	it('renders disabled', () => {
		const h = harness(() => (
			<ListBoxItem widgetId="test" disabled onRequestActive={noop} onSelect={noop}>
				test
			</ListBoxItem>
		));
		const disabledTemplate = template
			.setProperty('@root', 'classes', [css.root, false, false, css.disabled])
			.setProperty('@root', 'aria-disabled', true);
		h.expect(disabledTemplate);
	});

	it('renders active', () => {
		const h = harness(() => (
			<ListBoxItem widgetId="test" active onRequestActive={noop} onSelect={noop}>
				test
			</ListBoxItem>
		));
		const activeTemplate = template.setProperty('@root', 'classes', [
			css.root,
			false,
			css.active,
			false
		]);
		h.expect(activeTemplate);
	});

	it('requests active onpointermove', () => {
		const onRequestActive = sb.stub();
		const h = harness(() => (
			<ListBoxItem widgetId="test" onRequestActive={onRequestActive} onSelect={noop}>
				test
			</ListBoxItem>
		));
		h.trigger('@root', 'onpointermove');
		assert.isTrue(onRequestActive.calledOnce);
	});

	it('does not request active onpointermove when disabled', () => {
		const onRequestActive = sb.stub();
		const h = harness(() => (
			<ListBoxItem widgetId="test" disabled onRequestActive={onRequestActive} onSelect={noop}>
				test
			</ListBoxItem>
		));
		h.trigger('@root', 'onpointermove');
		assert.isTrue(onRequestActive.notCalled);
	});

	it('calls onSelect onpointerdown', () => {
		const onSelect = sb.stub();
		const h = harness(() => (
			<ListBoxItem widgetId="test" onRequestActive={noop} onSelect={onSelect}>
				test
			</ListBoxItem>
		));
		h.trigger('@root', 'onpointerdown');
		assert.isTrue(onSelect.calledOnce);
	});

	it('does not call onSelect onpointerdown when disabled', () => {
		const onSelect = sb.stub();
		const h = harness(() => (
			<ListBoxItem widgetId="test" disabled onRequestActive={noop} onSelect={onSelect}>
				test
			</ListBoxItem>
		));
		h.trigger('@root', 'onpointerdown');
		assert.isTrue(onSelect.notCalled);
	});
});
