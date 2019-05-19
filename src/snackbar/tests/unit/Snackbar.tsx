const { describe, it } = intern.getInterface('bdd');

import assertationTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/widget-core/tsx';
import Snackbar from '../../index';
import * as css from '../../../theme/snackbar.m.css';
import Button from '../../../button/index';

describe('Snackbar', () => {
	const template = assertationTemplate(() => {
		return (
			<div key="root" classes={[css.root, css.open]}>
				<div key="content" classes={css.content}>
					<div key="label" classes={css.label} role="status" aria-live="polite">
						test
					</div>
					<div key="actions" classes={css.actions} />
				</div>
			</div>
		);
	});

	it('renders', () => {
		const h = harness(() => <Snackbar message="test" open={true} />);
		h.expect(template);
	});

	it('renders closed', () => {
		const h = harness(() => <Snackbar message="test" open={false} />);
		const openTemplate = template.setProperty('@root', 'classes', [css.root]);
		h.expect(openTemplate);
	});

	it('renders success', () => {
		const h = harness(() => <Snackbar type="success" message="test" open={true} />);
		const successTemplate = template.setProperty('@root', 'classes', [
			css.root,
			css.open,
			css.success
		]);
		h.expect(successTemplate);
	});

	it('renders leading', () => {
		const h = harness(() => <Snackbar leading message="test" open={true} />);
		const successTemplate = template.setProperty('@root', 'classes', [
			css.root,
			css.open,
			css.leading
		]);
		h.expect(successTemplate);
	});

	it('renders stacked', () => {
		const h = harness(() => <Snackbar stacked message="test" open={true} />);
		const successTemplate = template.setProperty('@root', 'classes', [
			css.root,
			css.open,
			css.stacked
		]);
		h.expect(successTemplate);
	});

	it('renders error', () => {
		const h = harness(() => <Snackbar message="test" type="error" open={true} />);
		const errorTemplate = template.setProperty('@root', 'classes', [
			css.root,
			css.open,
			css.error
		]);
		h.expect(errorTemplate);
	});

	it('renders a single action', () => {
		const h = harness(() => (
			<Snackbar message="test" open={true} actionsRenderer={() => <Button>Dismiss</Button>} />
		));
		const actionsTemplate = template.setChildren('@actions', [<Button>Dismiss</Button>]);
		h.expect(actionsTemplate);
	});

	it('renders more than one action', () => {
		const h = harness(() => (
			<Snackbar
				message="test"
				open={true}
				actionsRenderer={() => [<Button>Retry</Button>, <Button>Close</Button>]}
			/>
		));
		const actionsTemplate = template.setChildren('@actions', [
			<Button>Retry</Button>,
			<Button>Close</Button>
		]);
		h.expect(actionsTemplate);
	});
});
