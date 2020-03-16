const { describe, it } = intern.getInterface('bdd');
import * as classes from '../../../theme/default/header.m.css';
import Header from '../..';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';

const baseTemplate = assertionTemplate(() => (
	<virtual key="virtual">
		<div key="root" classes={[classes.root, undefined]}>
			<div classes={classes.row}>
				<div classes={classes.primary} key="primary">
					<div classes={classes.title} key="title" />
				</div>
				<div classes={classes.secondary} key="secondary">
					<div classes={classes.actions} key="actions" />
				</div>
			</div>
		</div>
	</virtual>
));

describe('HeaderToolbar', () => {
	it('Renders default state', () => {
		const h = harness(() => <Header />);
		h.expect(baseTemplate);
	});

	it('Renders leading element', () => {
		const h = harness(() => (
			<Header>
				{{
					leading: () => 'leading'
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
					trailing: () => 'trailing'
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
					title: () => 'title'
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
					actions: () => ['action']
				}}
			</Header>
		));
		const testTemplate = baseTemplate.replaceChildren('@actions', () => [
			<div classes={classes.action}>action</div>
		]);
		h.expect(testTemplate);
	});

	it('Renders a sticky header', () => {
		const h = harness(() => <Header sticky />);
		const testTemplate = baseTemplate
			.append('@virtual', () => [<div classes={classes.spacer} />])
			.setProperty('@root', 'classes', [classes.root, classes.sticky]);
		h.expect(testTemplate);
	});
});
