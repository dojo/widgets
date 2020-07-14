import { sandbox } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import * as css from '../../theme/default/list-item.m.css';
import { ListItem } from '../../list';
const { describe, it, after } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

const noop: any = () => {};

describe('ListBoxItem', () => {
	const template = assertionTemplate(() => (
		<div
			key="root"
			onpointermove={noop}
			classes={[
				undefined,
				css.root,
				false,
				false,
				false,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined
			]}
			draggable={undefined}
			onclick={noop}
			role="option"
			aria-selected="false"
			aria-disabled="false"
			id="test"
			ondragend={undefined}
			ondragenter={noop}
			ondragover={undefined}
			ondragstart={undefined}
			ondrop={undefined}
			styles={{
				visibility: undefined
			}}
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
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop}>
				test
			</ListItem>
		));
		h.expect(template);
	});

	it('renders selected', () => {
		const h = harness(() => (
			<ListItem widgetId="test" selected onRequestActive={noop} onSelect={noop}>
				test
			</ListItem>
		));
		const selectedTemplate = template
			.setProperty('@root', 'classes', [
				undefined,
				css.root,
				css.selected,
				false,
				false,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined
			])
			.setProperty('@root', 'aria-selected', 'true');
		h.expect(selectedTemplate);
	});

	it('renders disabled', () => {
		const h = harness(() => (
			<ListItem widgetId="test" disabled onRequestActive={noop} onSelect={noop}>
				test
			</ListItem>
		));
		const disabledTemplate = template
			.setProperty('@root', 'classes', [
				undefined,
				css.root,
				false,
				false,
				css.disabled,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined
			])
			.setProperty('@root', 'aria-disabled', 'true');
		h.expect(disabledTemplate);
	});

	it('renders active', () => {
		const h = harness(() => (
			<ListItem widgetId="test" active onRequestActive={noop} onSelect={noop}>
				test
			</ListItem>
		));
		const activeTemplate = template.setProperty('@root', 'classes', [
			undefined,
			css.root,
			false,
			css.active,
			false,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined
		]);
		h.expect(activeTemplate);
	});

	it('renders moved up', () => {
		const h = harness(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop} movedUp>
				test
			</ListItem>
		));
		const selectedTemplate = template.setProperty('@root', 'classes', [
			undefined,
			css.root,
			false,
			false,
			false,
			css.movedUp,
			undefined,
			undefined,
			undefined,
			undefined
		]);
		h.expect(selectedTemplate);
	});

	it('renders moved down', () => {
		const h = harness(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop} movedDown>
				test
			</ListItem>
		));
		const selectedTemplate = template.setProperty('@root', 'classes', [
			undefined,
			css.root,
			false,
			false,
			false,
			undefined,
			css.movedDown,
			undefined,
			undefined,
			undefined
		]);
		h.expect(selectedTemplate);
	});

	it('renders collapsed', () => {
		const h = harness(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop} collapsed>
				test
			</ListItem>
		));
		const selectedTemplate = template.setProperty('@root', 'classes', [
			undefined,
			css.root,
			false,
			false,
			false,
			undefined,
			undefined,
			css.collapsed,
			undefined,
			undefined
		]);
		h.expect(selectedTemplate);
	});

	it('renders dragged', () => {
		const h = harness(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop} dragged>
				test
			</ListItem>
		));
		const selectedTemplate = template
			.setProperty('@root', 'classes', [
				undefined,
				css.root,
				false,
				false,
				false,
				undefined,
				undefined,
				undefined,
				css.dragged,
				undefined
			])
			.setProperty('@root', 'styles', { visibility: 'hidden' });
		h.expect(selectedTemplate);
	});

	it('requests active onpointermove', () => {
		const onRequestActive = sb.stub();
		const h = harness(() => (
			<ListItem widgetId="test" onRequestActive={onRequestActive} onSelect={noop}>
				test
			</ListItem>
		));
		h.trigger('@root', 'onpointermove');
		assert.isTrue(onRequestActive.calledOnce);
	});

	it('does not request active onpointermove when disabled', () => {
		const onRequestActive = sb.stub();
		const h = harness(() => (
			<ListItem widgetId="test" disabled onRequestActive={onRequestActive} onSelect={noop}>
				test
			</ListItem>
		));
		h.trigger('@root', 'onpointermove');
		assert.isTrue(onRequestActive.notCalled);
	});

	it('calls onSelect onclick', () => {
		const onSelect = sb.stub();
		const h = harness(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={onSelect}>
				test
			</ListItem>
		));
		h.trigger('@root', 'onclick');
		assert.isTrue(onSelect.calledOnce);
	});

	it('does not call onSelect onclick when disabled', () => {
		const onSelect = sb.stub();
		const h = harness(() => (
			<ListItem widgetId="test" disabled onRequestActive={noop} onSelect={onSelect}>
				test
			</ListItem>
		));
		h.trigger('@root', 'onclick');
		assert.isTrue(onSelect.notCalled);
	});
});
