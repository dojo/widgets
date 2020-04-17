const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';
import Card from '../../index';
import Button from '../../../button/index';
import Icon from '../../../icon';
import * as css from '../../../theme/default/card.m.css';
import { spy } from 'sinon';

const noop = () => {};
describe('Card', () => {
	const template = assertionTemplate(() => (
		<div key="root" classes={[undefined, css.root]}>
			<div key="content" classes={[css.content, null]} onClick={noop} />
		</div>
	));

	it('renders', () => {
		const h = harness(() => <Card />);
		h.expect(template);
	});

	describe('action', () => {
		const onAction = spy();
		const h = harness(() => <Card onAction={onAction} />);
		h.expect(template.setProperty('@content', 'classes', [css.content, css.primary]));

		h.trigger('@content', 'onClick');
		assert.isTrue(onAction.calledOnce);
	});

	describe('header', () => {
		it('renders header content', () => {
			const h = harness(() => (
				<Card>
					{{
						header: 'Hello, World'
					}}
				</Card>
			));

			h.expect(
				template.prepend('@root', () => [
					<div key="header" classes={css.header}>
						Hello, World
					</div>
				])
			);
		});
	});

	describe('content', () => {
		it('renders content', () => {
			const h = harness(() => (
				<Card>
					{{
						content: 'Hello, World'
					}}
				</Card>
			));
			h.expect(
				template.setChildren('@content', () => [
					<div classes={css.contentWrapper}>Hello, World</div>
				])
			);
		});

		it('renders a title and subtitle', () => {
			const h = harness(() => <Card title="Hello, World" subtitle="this is a test" />);
			h.expect(
				template.append('@content', () => [
					<div classes={css.titleWrapper}>
						{<h2 classes={css.title}>Hello, World</h2>}
						<h3 classes={css.subtitle}>this is a test</h3>
					</div>
				])
			);
		});

		it('renders a title, subtitle, and content', () => {
			const h = harness(() => (
				<Card title="Hello, World" subtitle="this is a test">
					{{
						content: 'test'
					}}
				</Card>
			));
			h.expect(
				template.append('@content', () => [
					<div classes={css.titleWrapper}>
						{<h2 classes={css.title}>Hello, World</h2>}
						<h3 classes={css.subtitle}>this is a test</h3>
					</div>,
					<div classes={css.contentWrapper}>test</div>
				])
			);
		});

		it('renders media', () => {
			const h = harness(() => <Card mediaSrc="test.png" mediaTitle="test" />);
			h.expect(
				template.append('@content', () => [
					<div
						title="test"
						classes={[css.media, css.media16by9]}
						styles={{
							backgroundImage: 'url("test.png")'
						}}
					/>
				])
			);
		});

		it('renders square media', () => {
			const h = harness(() => <Card square mediaSrc="test.png" mediaTitle="test" />);
			h.expect(
				template.append('@content', () => [
					<div
						title="test"
						classes={[css.media, css.mediaSquare]}
						styles={{
							backgroundImage: 'url("test.png")'
						}}
					/>
				])
			);
		});
	});

	describe('actions', () => {
		const actionsTemplate = template.append('@root', () => [
			<div key="actions" classes={css.actions} />
		]);

		it('renders action buttons', () => {
			const h = harness(() => (
				<Card>
					{{
						actionButtons: <Button>test</Button>
					}}
				</Card>
			));
			const childrenTemplate = actionsTemplate.setChildren('@actions', () => [
				<div classes={css.actionButtons}>
					<Button>test</Button>
				</div>
			]);
			h.expect(childrenTemplate);
		});

		it('renders action icons', () => {
			const h = harness(() => (
				<Card>
					{{
						actionIcons: <Icon type="upIcon" />
					}}
				</Card>
			));
			const childrenTemplate = actionsTemplate.setChildren('@actions', () => [
				<div classes={css.actionIcons}>
					<Icon type="upIcon" />
				</div>
			]);
			h.expect(childrenTemplate);
		});

		it('renders action buttons and icons', () => {
			const h = harness(() => (
				<Card>
					{{
						actionButtons: <Button>test</Button>,
						actionIcons: <Icon type="upIcon" />
					}}
				</Card>
			));
			const childrenTemplate = actionsTemplate.setChildren('@actions', () => [
				<div classes={css.actionButtons}>
					<Button>test</Button>
				</div>,
				<div classes={css.actionIcons}>
					<Icon type="upIcon" />
				</div>
			]);
			h.expect(childrenTemplate);
		});
	});

	it('renders everything together', () => {
		const h = harness(() => (
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

		h.expect(
			template
				.prepend('@root', () => [
					<div key="header" classes={css.header}>
						Header Content
					</div>
				])
				.setChildren('@content', () => [
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
				.append('@root', () => [
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
