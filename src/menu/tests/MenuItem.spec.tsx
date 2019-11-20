import { sandbox } from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import * as css from '../../theme/menu-item.m.css';
import MenuItem from '../MenuItem';
const { describe, it, after } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

const noop: any = () => {};

describe('MenuItem', () => {
	const template = assertionTemplate(() => (
		<div
			key="root"
			onpointermove={noop}
			classes={[css.root, false, false, false]}
			onpointerdown={noop}
			scrollIntoView={false}
			role="option"
			aria-selected={false}
			aria-disabled={false}
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
			<MenuItem id="test" onActive={noop} onRequestActive={noop} onSelect={noop}>
				test
			</MenuItem>
		));
		h.expect(template);
	});

	it('renders selected', () => {
		const h = harness(() => (
			<MenuItem id="test" onActive={noop} selected onRequestActive={noop} onSelect={noop}>
				test
			</MenuItem>
		));
		const selectedTemplate = template
			.setProperty('@root', 'classes', [css.root, css.selected, false, false])
			.setProperty('@root', 'aria-selected', true);
		h.expect(selectedTemplate);
	});

	it('renders disabled', () => {
		const h = harness(() => (
			<MenuItem id="test" onActive={noop} disabled onRequestActive={noop} onSelect={noop}>
				test
			</MenuItem>
		));
		const disabledTemplate = template
			.setProperty('@root', 'classes', [css.root, false, false, css.disabled])
			.setProperty('@root', 'aria-disabled', true);
		h.expect(disabledTemplate);
	});

	it('renders with scroll into view', () => {
		const h = harness(() => (
			<MenuItem
				id="test"
				onActive={noop}
				scrollIntoView
				onRequestActive={noop}
				onSelect={noop}
			>
				test
			</MenuItem>
		));
		const scrollIntoViewTemplate = template.setProperty('@root', 'scrollIntoView', true);
		h.expect(scrollIntoViewTemplate);
	});

	it('renders active', () => {
		const onActive = sb.stub();
		const h = harness(() => (
			<MenuItem id="test" onActive={onActive} active onRequestActive={noop} onSelect={noop}>
				test
			</MenuItem>
		));
		const disabledTemplate = template.setProperty('@root', 'classes', [
			css.root,
			false,
			css.active,
			false
		]);
		h.expect(disabledTemplate);
		assert.isTrue(onActive.calledOnce);
	});

	it('requests active onpointermove', () => {
		const onRequestActive = sb.stub();
		const h = harness(() => (
			<MenuItem id="test" onActive={noop} onRequestActive={onRequestActive} onSelect={noop}>
				test
			</MenuItem>
		));
		h.trigger('@root', 'onpointermove');
		assert.isTrue(onRequestActive.calledOnce);
	});

	it('does not request active onpointermove when disabled', () => {
		const onRequestActive = sb.stub();
		const h = harness(() => (
			<MenuItem
				id="test"
				onActive={noop}
				disabled
				onRequestActive={onRequestActive}
				onSelect={noop}
			>
				test
			</MenuItem>
		));
		h.trigger('@root', 'onpointermove');
		assert.isTrue(onRequestActive.notCalled);
	});

	it('calls onSelect onpointerdown', () => {
		const onSelect = sb.stub();
		const h = harness(() => (
			<MenuItem id="test" onActive={noop} onRequestActive={noop} onSelect={onSelect}>
				test
			</MenuItem>
		));
		h.trigger('@root', 'onpointerdown');
		assert.isTrue(onSelect.calledOnce);
	});

	it('does not call onSelect onpointerdown when disabled', () => {
		const onSelect = sb.stub();
		const h = harness(() => (
			<MenuItem id="test" onActive={noop} disabled onRequestActive={noop} onSelect={onSelect}>
				test
			</MenuItem>
		));
		h.trigger('@root', 'onpointerdown');
		assert.isTrue(onSelect.notCalled);
	});
});
