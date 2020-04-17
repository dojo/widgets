const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';
import Result from '../../index';
import Button from '../../../button/index';
import Icon from '../../../icon';
import * as css from '../../../theme/default/result.m.css';

describe('Result', () => {
	const template = assertionTemplate(() => <div key="root" classes={[undefined, css.root]} />);

	it('renders', () => {
		const h = harness(() => <Result />);
		h.expect(template);
	});

	describe('title', () => {
		it('renders title content', () => {
			const h = harness(() => <Result title="Foo" subtitle="Bar" />);

			h.expect(
				template.setChildren('@root', () => [
					<div classes={css.titleWrapper}>
						{<h2 classes={css.title}>Foo</h2>}
						<h3 classes={css.subtitle}>Bar</h3>
					</div>
				])
			);
		});
	});

	describe('status', () => {
		it('renders custom status icon', () => {
			const h = harness(() => <Result>{{ icon: <Icon type="clockIcon" /> }}</Result>);

			h.expect(
				template.setChildren('@root', () => [
					<div key="iconWrapper" classes={[css.iconWrapper, null, null]}>
						<Icon type="clockIcon" />
					</div>
				])
			);
		});
	});

	describe('content', () => {
		it('renders content', () => {
			const h = harness(() => (
				<Result>
					{{
						content: 'Result Content'
					}}
				</Result>
			));
			h.expect(
				template.setChildren('@root', () => [
					<div classes={css.contentWrapper}>Result Content</div>
				])
			);
		});

		it('renders title and subtitle', () => {
			const h = harness(() => <Result title="Foo" subtitle="Bar" />);

			h.expect(
				template.setChildren('@root', () => [
					<div classes={css.titleWrapper}>
						{<h2 classes={css.title}>Foo</h2>}
						<h3 classes={css.subtitle}>Bar</h3>
					</div>
				])
			);
		});

		it('renders content, title, and subtitle', () => {
			const h = harness(() => (
				<Result title="Foo" subtitle="Bar">
					{{
						content: 'Result Content'
					}}
				</Result>
			));
			h.expect(
				template.setChildren('@root', () => [
					<div classes={css.titleWrapper}>
						{<h2 classes={css.title}>Foo</h2>}
						<h3 classes={css.subtitle}>Bar</h3>
					</div>,
					<div classes={css.contentWrapper}>Result Content</div>
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
				<Result>
					{{
						actionButtons: <Button>test</Button>
					}}
				</Result>
			));
			const childrenTemplate = actionsTemplate.setChildren('@actions', () => [
				<div classes={css.actionButtons}>
					<Button>test</Button>
				</div>
			]);
			h.expect(childrenTemplate);
		});
	});

	it('renders everything', () => {
		const h = harness(() => (
			<Result title="Foo" subtitle="Bar">
				{{
					icon: <Icon type="clockIcon" />,
					content: 'Result Content',
					actionButtons: <Button>test</Button>
				}}
			</Result>
		));

		h.expect(
			template.setChildren('@root', () => [
				<div key="iconWrapper" classes={[css.iconWrapper, null, null]}>
					<Icon type="clockIcon" />
				</div>,
				<div classes={css.titleWrapper}>
					{<h2 classes={css.title}>Foo</h2>}
					<h3 classes={css.subtitle}>Bar</h3>
				</div>,
				<div classes={css.contentWrapper}>Result Content</div>,
				<div key="actions" classes={css.actions}>
					<div classes={css.actionButtons}>
						<Button>test</Button>
					</div>
				</div>
			])
		);
	});
});
