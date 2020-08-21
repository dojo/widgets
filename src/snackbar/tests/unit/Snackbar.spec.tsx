const { describe, it } = intern.getInterface('bdd');

import assertationTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';
import Snackbar from '../../index';
import * as css from '../../../theme/default/snackbar.m.css';
import * as fixedCss from '../../styles/snackbar.m.css';
import Button from '../../../button/index';

describe('Snackbar', () => {
	const template = assertationTemplate(() => {
		return (
			<div
				key="root"
				classes={[undefined, css.root, fixedCss.root, css.open, null, null, null]}
			>
				<div key="content" classes={css.content}>
					<div
						key="label"
						assertion-key="label"
						classes={css.label}
						role="status"
						aria-live="polite"
					>
						test
					</div>
				</div>
			</div>
		);
	});

	it('renders', () => {
		const h = harness(() => (
			<Snackbar open={true}>
				{{
					message: 'test'
				}}
			</Snackbar>
		));
		h.expect(template);
	});

	it('renders non string message', () => {
		const h = harness(() => (
			<Snackbar open={true}>
				{{
					message: <div>test</div>
				}}
			</Snackbar>
		));
		const nonStringTemplate = template.setChildren('@label', [<div>test</div>]);
		h.expect(nonStringTemplate);
	});

	it('renders an array of non string messages', () => {
		const h = harness(() => (
			<Snackbar open={true}>
				{{
					message: [<div>test</div>, <div>test2</div>]
				}}
			</Snackbar>
		));
		const multipleNonStringTemplate = template.setChildren('@label', [
			<div>test</div>,
			<div>test2</div>
		]);
		h.expect(multipleNonStringTemplate);
	});

	it('renders closed', () => {
		const h = harness(() => (
			<Snackbar open={false}>
				{{
					message: 'test'
				}}
			</Snackbar>
		));
		const openTemplate = template.setProperty('@root', 'classes', [
			undefined,
			css.root,
			fixedCss.root,
			null,
			null,
			null,
			null
		]);
		h.expect(openTemplate);
	});

	it('renders success', () => {
		const h = harness(() => (
			<Snackbar type="success" open={true}>
				{{
					message: 'test'
				}}
			</Snackbar>
		));
		const successTemplate = template.setProperty('@root', 'classes', [
			undefined,
			css.root,
			fixedCss.root,
			css.open,
			css.success,
			null,
			null
		]);
		h.expect(successTemplate);
	});

	it('renders leading', () => {
		const h = harness(() => (
			<Snackbar leading open={true}>
				{{
					message: 'test'
				}}
			</Snackbar>
		));
		const successTemplate = template.setProperty('@root', 'classes', [
			undefined,
			css.root,
			fixedCss.root,
			css.open,
			null,
			css.leading,
			null
		]);
		h.expect(successTemplate);
	});

	it('renders stacked', () => {
		const h = harness(() => (
			<Snackbar stacked open={true}>
				{{
					message: 'test'
				}}
			</Snackbar>
		));
		const successTemplate = template.setProperty('@root', 'classes', [
			undefined,
			css.root,
			fixedCss.root,
			css.open,
			null,
			null,
			css.stacked
		]);
		h.expect(successTemplate);
	});

	it('renders error', () => {
		const h = harness(() => (
			<Snackbar type="error" open={true}>
				{{
					message: 'test'
				}}
			</Snackbar>
		));
		const errorTemplate = template.setProperty('@root', 'classes', [
			undefined,
			css.root,
			fixedCss.root,
			css.open,
			css.error,
			null,
			null
		]);
		h.expect(errorTemplate);
	});

	it('renders a single action', () => {
		const h = harness(() => (
			<Snackbar open={true}>
				{{
					message: 'test',
					actions: <Button>Dismiss</Button>
				}}
			</Snackbar>
		));
		const actionsTemplate = template.insertAfter('~label', [
			<div key="actions" classes={css.actions}>
				<Button>Dismiss</Button>
			</div>
		]);
		h.expect(actionsTemplate);
	});

	it('renders more than one action', () => {
		const h = harness(() => (
			<Snackbar open={true}>
				{{
					message: 'test',
					actions: [<Button>Retry</Button>, <Button>Close</Button>]
				}}
			</Snackbar>
		));
		const actionsTemplate = template.insertAfter('~label', [
			<div key="actions" classes={css.actions}>
				<Button>Retry</Button>
				<Button>Close</Button>
			</div>
		]);
		h.expect(actionsTemplate);
	});
});
