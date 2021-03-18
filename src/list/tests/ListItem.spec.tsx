import { sandbox, assert as assertSinon } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import * as css from '../../theme/default/list-item.m.css';
import { ListItem } from '../../list';
import renderer, { assertion, wrap } from '@dojo/framework/testing/renderer';
const { describe, it, after } = intern.getInterface('bdd');

const noop: any = () => {};
const WrappedRoot = wrap('div');

describe('ListBoxItem', () => {
	const template = assertion(() => (
		<WrappedRoot
			key="root"
			onpointermove={noop}
			classes={[
				undefined,
				css.root,
				css.height,
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
		</WrappedRoot>
	));
	const disabledTemplate = template
		.setProperty(WrappedRoot, 'classes', [
			undefined,
			css.root,
			css.height,
			false,
			false,
			css.disabled,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined
		])
		.setProperty(WrappedRoot, 'aria-disabled', 'true');

	const sb = sandbox.create();

	after(() => {
		sb.restore();
	});

	it('renders with a label', () => {
		const r = renderer(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop}>
				test
			</ListItem>
		));
		r.expect(template);
	});

	it('renders selected', () => {
		const r = renderer(() => (
			<ListItem widgetId="test" selected onRequestActive={noop} onSelect={noop}>
				test
			</ListItem>
		));
		const selectedTemplate = template
			.setProperty(WrappedRoot, 'classes', [
				undefined,
				css.root,
				css.height,
				css.selected,
				false,
				false,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined
			])
			.setProperty(WrappedRoot, 'aria-selected', 'true');
		r.expect(selectedTemplate);
	});

	it('renders disabled', () => {
		const r = renderer(() => (
			<ListItem widgetId="test" disabled onRequestActive={noop} onSelect={noop}>
				test
			</ListItem>
		));
		r.expect(disabledTemplate);
	});

	it('renders active', () => {
		const r = renderer(() => (
			<ListItem widgetId="test" active onRequestActive={noop} onSelect={noop}>
				test
			</ListItem>
		));
		const activeTemplate = template.setProperty(WrappedRoot, 'classes', [
			undefined,
			css.root,
			css.height,
			false,
			css.active,
			false,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined
		]);
		r.expect(activeTemplate);
	});

	it('renders moved up', () => {
		const r = renderer(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop} movedUp>
				test
			</ListItem>
		));
		const selectedTemplate = template.setProperty(WrappedRoot, 'classes', [
			undefined,
			css.root,
			css.height,
			false,
			false,
			false,
			css.movedUp,
			undefined,
			undefined,
			undefined,
			undefined
		]);
		r.expect(selectedTemplate);
	});

	it('renders moved down', () => {
		const r = renderer(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop} movedDown>
				test
			</ListItem>
		));
		const selectedTemplate = template.setProperty(WrappedRoot, 'classes', [
			undefined,
			css.root,
			css.height,
			false,
			false,
			false,
			undefined,
			css.movedDown,
			undefined,
			undefined,
			undefined
		]);
		r.expect(selectedTemplate);
	});

	it('renders collapsed', () => {
		const r = renderer(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop} collapsed>
				test
			</ListItem>
		));
		const selectedTemplate = template.setProperty(WrappedRoot, 'classes', [
			undefined,
			css.root,
			css.height,
			false,
			false,
			false,
			undefined,
			undefined,
			css.collapsed,
			undefined,
			undefined
		]);
		r.expect(selectedTemplate);
	});

	it('renders dragged', () => {
		const r = renderer(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop} dragged>
				test
			</ListItem>
		));
		const selectedTemplate = template
			.setProperty(WrappedRoot, 'classes', [
				undefined,
				css.root,
				css.height,
				false,
				false,
				false,
				undefined,
				undefined,
				undefined,
				css.dragged,
				undefined
			])
			.setProperty(WrappedRoot, 'styles', { visibility: 'hidden' });
		r.expect(selectedTemplate);
	});

	it('requests active onpointermove', () => {
		const onRequestActive = sb.stub();
		const r = renderer(() => (
			<ListItem widgetId="test" onRequestActive={onRequestActive} onSelect={noop}>
				test
			</ListItem>
		));
		r.expect(template);
		r.property(WrappedRoot, 'onpointermove');
		r.expect(template);
		assertSinon.calledOnce(onRequestActive);
	});

	it('does not request active onpointermove when disabled', () => {
		const onRequestActive = sb.stub();
		const r = renderer(() => (
			<ListItem widgetId="test" disabled onRequestActive={onRequestActive} onSelect={noop}>
				test
			</ListItem>
		));
		r.expect(disabledTemplate);
		r.property(WrappedRoot, 'onpointermove');
		r.expect(disabledTemplate);
		assertSinon.notCalled(onRequestActive);
	});

	it('calls onSelect onclick', () => {
		const onSelect = sb.stub();
		const r = renderer(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={onSelect}>
				test
			</ListItem>
		));
		r.expect(template);
		r.property(WrappedRoot, 'onclick');
		r.expect(template);
		assertSinon.calledOnce(onSelect);
	});

	it('does not call onSelect onclick when disabled', () => {
		const onSelect = sb.stub();
		const r = renderer(() => (
			<ListItem widgetId="test" disabled onRequestActive={noop} onSelect={onSelect}>
				test
			</ListItem>
		));
		r.expect(disabledTemplate);
		r.property(WrappedRoot, 'onclick');
		r.expect(disabledTemplate);
		assertSinon.notCalled(onSelect);
	});
});
