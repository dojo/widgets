const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';
import assertationTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/widget-core/tsx';
import Snackbar from '../../index';
import * as css from '../../../theme/snackbar.m.css';
import Button from '../../../button/index';
import bundle from '../../nls/Snackbar';
import { Store } from '@dojo/framework/stores/Store';
import { createProcess } from '@dojo/framework/stores/process';
import { replace } from '@dojo/framework/stores/state/operations';

describe('Snackbar', () => {
	const template = assertationTemplate(() => {
		return (
			<div key="root" classes={[css.root]}>
				<div key="content" classes={css.content}>
					<div key="label" classes={css.label} role="status" aria-live="polite">
						test
					</div>
					<div key="actions" classes={css.actions}>
						<Button name="snackbar-dismiss" key="dismiss" onClick={sinon.spy()}>
							{bundle.messages.dismiss}
						</Button>
					</div>
				</div>
			</div>
		);
	});

	it('renders', () => {
		const h = harness(() => <Snackbar title="test" open={false} />);
		h.expect(template);
	});

	it('renders open', () => {
		const h = harness(() => <Snackbar title="test" open={true} />);
		const openTemplate = template.setProperty('@root', 'classes', [css.root, css.open]);
		h.expect(openTemplate);
	});

	it('renders success', () => {
		const h = harness(() => <Snackbar success={true} title="test" open={true} />);
		const successTemplate = template.setProperty('@root', 'classes', [
			css.root,
			css.open,
			css.success
		]);
		h.expect(successTemplate);
	});

	it('renders error', () => {
		const h = harness(() => <Snackbar title="test" success={false} open={true} />);
		const errorTemplate = template.setProperty('@root', 'classes', [
			css.root,
			css.open,
			css.error
		]);
		h.expect(errorTemplate);
	});

	it('calls the onDismiss property when the dismiss button is triggered', () => {
		const dismissSpy = sinon.spy();
		const h = harness(() => <Snackbar title="test" open={false} onDismiss={dismissSpy} />);
		h.trigger('@dismiss', 'onClick');
		assert.isTrue(dismissSpy.calledOnce);
	});
});
