const { describe, it } = intern.getInterface('bdd');
import { tsx } from '@dojo/framework/core/vdom';
import Link from '@dojo/framework/routing/Link';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import Header, { Action } from '../..';
import * as classes from '../../../theme/default/header.m.css';

const baseTemplate = assertionTemplate(() => (
	<header key="header" classes={[undefined, undefined]}>
		<div key="root" classes={[classes.root, undefined]}>
			<div classes={classes.row}>
				<div classes={classes.primary} key="primary">
					<div classes={classes.title} key="title">
						title
					</div>
				</div>
				<div classes={classes.secondary} key="secondary">
					<nav classes={classes.actions} key="actions" />
				</div>
			</div>
		</div>
	</header>
));

describe('HeaderToolbar', () => {
	it('Renders default state', () => {
		const h = harness(() => (
			<Header>
				{{
					title: 'title'
				}}
			</Header>
		));
		h.expect(baseTemplate);
	});

	it('Renders leading element', () => {
		const h = harness(() => (
			<Header>
				{{
					title: 'title',
					leading: 'leading'
				}}
			</Header>
		));
		const testTemplate = baseTemplate.prepend('@primary', () => [
			<div classes={classes.leading}>leading</div>
		]);
		h.expect(testTemplate);
	});

	it('Renders trailing element', () => {
		const h = harness(() => (
			<Header>
				{{
					title: 'title',
					trailing: 'trailing'
				}}
			</Header>
		));
		const testTemplate = baseTemplate.append('@secondary', () => [
			<div classes={classes.trailing}>trailing</div>
		]);
		h.expect(testTemplate);
	});

	it('Renders title element', () => {
		const h = harness(() => (
			<Header>
				{{
					title: 'title'
				}}
			</Header>
		));
		const testTemplate = baseTemplate.replaceChildren('@title', () => ['title']);
		h.expect(testTemplate);
	});

	it('Renders action elements', () => {
		const h = harness(() => (
			<Header>
				{{
					title: 'title',
					actions: [<Action to="#foo">Action</Action>]
				}}
			</Header>
		));
		const testTemplate = baseTemplate.replaceChildren('@actions', () => [
			<Action to="#foo">Action</Action>
		]);
		h.expect(testTemplate);
	});

	it('Renders a single action element', () => {
		const h = harness(() => (
			<Header>
				{{
					title: 'title',
					actions: <Action to="#foo">Action</Action>
				}}
			</Header>
		));
		const testTemplate = baseTemplate.replaceChildren('@actions', () => [
			<Action to="#foo">Action</Action>
		]);
		h.expect(testTemplate);
	});

	it('renders action as link', () => {
		const h = harness(() => <Action to="#foo">test</Action>);
		h.expect(
			assertionTemplate(() => (
				<Link to="#foo" classes={[undefined, classes.action]}>
					test
				</Link>
			))
		);
	});

	it('Renders a sticky header', () => {
		const h = harness(() => (
			<Header sticky>
				{{
					title: 'title'
				}}
			</Header>
		));
		const testTemplate = baseTemplate
			.setProperty('@root', 'classes', [classes.root, classes.sticky])
			.setProperty('@header', 'classes', [undefined, classes.spacer]);
		h.expect(testTemplate);
	});
});
