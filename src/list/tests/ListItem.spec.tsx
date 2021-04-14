import { sandbox, assert as assertSinon } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import * as css from '../../theme/default/list-item.m.css';
import { ListItem } from '../../list';
import renderer, { assertion, wrap } from '@dojo/framework/testing/renderer';
import Icon from '../../icon';
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
				false,
				false,
				false,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				css.mediumPadding
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
			false,
			false,
			css.disabled,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			css.mediumPadding
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

	it('renders with leading and trailing items', () => {
		const r = renderer(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop}>
				{{
					leading: 'In front',
					primary: 'test',
					trailing: 'After'
				}}
			</ListItem>
		));
		r.expect(
			template.setChildren(WrappedRoot, () => (
				<virtual>
					<span classes={css.leading}>In front</span>
					<span classes={css.primary}>test</span>
					<span classes={css.trailing}>After</span>
				</virtual>
			))
		);
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
				css.selected,
				false,
				false,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				css.mediumPadding
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
			false,
			css.active,
			false,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			css.mediumPadding
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
			false,
			false,
			false,
			css.movedUp,
			undefined,
			undefined,
			undefined,
			undefined,
			css.mediumPadding
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
			false,
			false,
			false,
			undefined,
			css.movedDown,
			undefined,
			undefined,
			undefined,
			css.mediumPadding
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
			false,
			false,
			false,
			undefined,
			undefined,
			css.collapsed,
			undefined,
			undefined,
			css.mediumPadding
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
				false,
				false,
				false,
				undefined,
				undefined,
				undefined,
				css.dragged,
				undefined,
				css.mediumPadding
			])
			.setProperty(WrappedRoot, 'styles', { visibility: 'hidden' });
		r.expect(selectedTemplate);
	});

	it('renders draggable', () => {
		const r = renderer(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop} draggable>
				{{ primary: 'test' }}
			</ListItem>
		));
		const draggableTemplate = template
			.setProperty(WrappedRoot, 'draggable', true)
			.setProperty(WrappedRoot, 'classes', [
				undefined,
				css.root,
				false,
				false,
				false,
				undefined,
				undefined,
				undefined,
				undefined,
				css.draggable,
				css.mediumPadding
			])
			.setChildren(WrappedRoot, () => (
				<virtual>
					<span classes={css.primary}>test</span>
					<Icon
						type="barsIcon"
						classes={{ '@dojo/widgets/icon': { icon: [css.dragIcon] } }}
						theme={undefined}
						variant={undefined}
					/>
				</virtual>
			));
		r.expect(draggableTemplate);
	});

	it('renders draggable with custom icon', () => {
		const r = renderer(() => (
			<ListItem widgetId="test" onRequestActive={noop} onSelect={noop} draggable>
				{{
					primary: 'test',
					trailing: <Icon type="starIcon" />
				}}
			</ListItem>
		));
		const draggableTemplate = template
			.setProperty(WrappedRoot, 'draggable', true)
			.setProperty(WrappedRoot, 'classes', [
				undefined,
				css.root,
				false,
				false,
				false,
				undefined,
				undefined,
				undefined,
				undefined,
				css.draggable,
				css.mediumPadding
			])
			.setChildren(WrappedRoot, () => (
				<virtual>
					<span classes={css.primary}>test</span>
					<span classes={css.trailing}>
						<Icon type="starIcon" />
					</span>
				</virtual>
			));
		r.expect(draggableTemplate);
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
