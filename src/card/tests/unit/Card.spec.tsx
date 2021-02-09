const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import renderer, { assertion, wrap } from '@dojo/framework/testing/renderer';
import { tsx } from '@dojo/framework/core/vdom';
import Card from '../../index';
import Button from '../../../button/index';
import Icon from '../../../icon';
import * as css from '../../../theme/default/card.m.css';
import { spy } from 'sinon';

const noop = () => {};

const Root = wrap('div');
const Content = wrap('div');

const template = assertion(() => (
	<Root key="root" classes={[undefined, css.root, false]}>
		<Content key="content" classes={[css.content, null]} onClick={noop} />
	</Root>
));

describe('Card', () => {
	it('renders', () => {
		const r = renderer(() => <Card />);
		r.expect(template);
	});

	it('renders outlined', () => {
		const r = renderer(() => <Card outlined />);
		const outlinedTemplate = template.setProperty(Root, 'classes', [
			undefined,
			css.root,
			css.outlined
		]);
		r.expect(outlinedTemplate);
	});

	describe('action', () => {
		const onAction = spy();
		const r = renderer(() => <Card onAction={onAction} />);

		const actionTemplate = template.setProperty(Content, 'classes', [css.content, css.primary]);

		r.expect(actionTemplate);
		r.property(Content, 'onClick');
		r.expect(actionTemplate);
		assert.isTrue(onAction.calledOnce);
	});

	describe('header', () => {
		it('renders header content', () => {
			const r = renderer(() => (
				<Card>
					{{
						header: 'Hello, World'
					}}
				</Card>
			));

			const headerTemplate = template.prepend(Root, () => [
				<div key="header" classes={css.header}>
					Hello, World
				</div>
			]);

			r.expect(headerTemplate);
		});
	});

	describe('content', () => {
		it('renders content', () => {
			const r = renderer(() => (
				<Card>
					{{
						content: 'Hello, World'
					}}
				</Card>
			));

			const contentTemplate = template.setChildren(Content, () => [
				<div classes={css.contentWrapper}>Hello, World</div>
			]);
			r.expect(contentTemplate);
		});

		it('renders a title and subtitle', () => {
			const r = renderer(() => <Card title="Hello, World" subtitle="this is a test" />);
			const contentTemplate = template.append(Content, () => [
				<div classes={css.titleWrapper}>
					{<h2 classes={css.title}>Hello, World</h2>}
					<h3 classes={css.subtitle}>this is a test</h3>
				</div>
			]);
			r.expect(contentTemplate);
		});

		it('renders a title, subtitle, and content', () => {
			const r = renderer(() => (
				<Card title="Hello, World" subtitle="this is a test">
					{{
						content: 'test'
					}}
				</Card>
			));
			const contentTemplate = template.append(Content, () => [
				<div classes={css.titleWrapper}>
					{<h2 classes={css.title}>Hello, World</h2>}
					<h3 classes={css.subtitle}>this is a test</h3>
				</div>,
				<div classes={css.contentWrapper}>test</div>
			]);
			r.expect(contentTemplate);
		});

		it('renders media', () => {
			const r = renderer(() => <Card mediaSrc="test.png" mediaTitle="test" />);
			const contentTemplate = template.append(Content, () => [
				<div
					title="test"
					classes={[css.media, css.media16by9]}
					styles={{
						backgroundImage: 'url("test.png")'
					}}
				/>
			]);
			r.expect(contentTemplate);
		});

		it('renders square media', () => {
			const r = renderer(() => <Card square mediaSrc="test.png" mediaTitle="test" />);
			const contentTemplate = template.append(Content, () => [
				<div
					title="test"
					classes={[css.media, css.mediaSquare]}
					styles={{
						backgroundImage: 'url("test.png")'
					}}
				/>
			]);
			r.expect(contentTemplate);
		});
	});

	describe('actions', () => {
		const Actions = wrap('div');
		const actionsTemplate = template.append(Root, () => [
			<Actions key="actions" classes={css.actions} />
		]);

		it('renders action buttons', () => {
			const r = renderer(() => (
				<Card>
					{{
						actionButtons: <Button>test</Button>
					}}
				</Card>
			));
			const childrenTemplate = actionsTemplate.setChildren(Actions, () => [
				<div classes={css.actionButtons}>
					<Button>test</Button>
				</div>
			]);
			r.expect(childrenTemplate);
		});

		it('renders action icons', () => {
			const r = renderer(() => (
				<Card>
					{{
						actionIcons: <Icon type="upIcon" />
					}}
				</Card>
			));
			const childrenTemplate = actionsTemplate.setChildren(Actions, () => [
				<div classes={css.actionIcons}>
					<Icon type="upIcon" />
				</div>
			]);
			r.expect(childrenTemplate);
		});

		it('renders action buttons and icons', () => {
			const r = renderer(() => (
				<Card>
					{{
						actionButtons: <Button>test</Button>,
						actionIcons: <Icon type="upIcon" />
					}}
				</Card>
			));
			const childrenTemplate = actionsTemplate.setChildren(Actions, () => [
				<div classes={css.actionButtons}>
					<Button>test</Button>
				</div>,
				<div classes={css.actionIcons}>
					<Icon type="upIcon" />
				</div>
			]);
			r.expect(childrenTemplate);
		});
	});

	it('renders everything together', () => {
		const r = renderer(() => (
			<Card
				title="Hello, World"
				subtitle="this is a test"
				mediaSrc="test.png"
				mediaTitle="test"
				square
			>
				{{
					header: 'Header Content',
					content: 'Content',
					actionButtons: <Button>test</Button>,
					actionIcons: <Icon type="upIcon" />
				}}
			</Card>
		));

		r.expect(
			template
				.prepend(Root, () => [
					<div key="header" classes={css.header}>
						Header Content
					</div>
				])
				.setChildren(Content, () => [
					<div
						title="test"
						classes={[css.media, css.mediaSquare]}
						styles={{
							backgroundImage: 'url("test.png")'
						}}
					/>,
					<div classes={css.titleWrapper}>
						{<h2 classes={css.title}>Hello, World</h2>}
						<h3 classes={css.subtitle}>this is a test</h3>
					</div>,
					<div classes={css.contentWrapper}>Content</div>
				])
				.append(Root, () => [
					<div key="actions" classes={css.actions}>
						<div classes={css.actionButtons}>
							<Button>test</Button>
						</div>
						<div classes={css.actionIcons}>
							<Icon type="upIcon" />
						</div>
					</div>
				])
		);
	});
});
