import { sandbox } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import * as css from '../../theme/default/menu-item.m.css';
import { MenuItem } from '../../list';
const { describe, it, after } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

const noop: any = () => {};

describe('MenuItem', () => {
	const template = assertionTemplate(() => (
		<div
			key="root"
			onpointermove={noop}
			classes={[undefined, css.root, false, false]}
			onclick={noop}
			role="menuitem"
			aria-disabled="false"
			id="test"
		>
			test
		</div>
	));

	const sb = sandbox.create();

	after(() => {
		sb.restore();
	});

	it('renders with a label', () => {
		const h = harness(() => (
			<MenuItem widgetId="test" onRequestActive={noop} onSelect={noop}>
				test
			</MenuItem>
		));
		h.expect(template);
	});

	it('renders disabled', () => {
		const h = harness(() => (
			<MenuItem widgetId="test" disabled onRequestActive={noop} onSelect={noop}>
				test
			</MenuItem>
		));
		const disabledTemplate = template
			.setProperty('@root', 'classes', [undefined, css.root, false, css.disabled])
			.setProperty('@root', 'aria-disabled', 'true');
		h.expect(disabledTemplate);
	});

	it('renders active', () => {
		const h = harness(() => (
			<MenuItem widgetId="test" active onRequestActive={noop} onSelect={noop}>
				test
			</MenuItem>
		));
		const activeTemplate = template.setProperty('@root', 'classes', [
			undefined,
			css.root,
			css.active,
			false
		]);
		h.expect(activeTemplate);
	});

	it('requests active onpointermove', () => {
		const onRequestActive = sb.stub();
		const h = harness(() => (
			<MenuItem widgetId="test" onRequestActive={onRequestActive} onSelect={noop}>
				test
			</MenuItem>
		));
		h.trigger('@root', 'onpointermove');
		assert.isTrue(onRequestActive.calledOnce);
	});

	it('does not request active onpointermove when disabled', () => {
		const onRequestActive = sb.stub();
		const h = harness(() => (
			<MenuItem widgetId="test" disabled onRequestActive={onRequestActive} onSelect={noop}>
				test
			</MenuItem>
		));
		h.trigger('@root', 'onpointermove');
		assert.isTrue(onRequestActive.notCalled);
	});

	it('calls onSelect onclick', () => {
		const onSelect = sb.stub();
		const h = harness(() => (
			<MenuItem widgetId="test" onRequestActive={noop} onSelect={onSelect}>
				test
			</MenuItem>
		));
		h.trigger('@root', 'onclick');
		assert.isTrue(onSelect.calledOnce);
	});

	it('does not call onSelect onclick when disabled', () => {
		const onSelect = sb.stub();
		const h = harness(() => (
			<MenuItem widgetId="test" disabled onRequestActive={noop} onSelect={onSelect}>
				test
			</MenuItem>
		));
		h.trigger('@root', 'onclick');
		assert.isTrue(onSelect.notCalled);
	});
});
