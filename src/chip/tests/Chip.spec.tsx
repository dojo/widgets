import { Keys } from '../../common/util';

const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';
import * as sinon from 'sinon';
import Chip from '../index';
import * as css from '../../theme/default/chip.m.css';
import Icon from '../../icon/index';

function noop() {}

describe('Chip', () => {
	const label = 'Chip label';
	const template = assertionTemplate(() => (
		<div
			key="root"
			classes={[css.root, undefined, undefined]}
			role={undefined}
			onclick={noop}
			tabIndex={undefined}
			onkeydown={noop}
		>
			<span classes={css.label}>{label}</span>
		</div>
	));

	it('should render with a label', () => {
		const h = harness(() => <Chip label={label} />);

		h.expect(template);
	});

	it('should render with an iconRenderer', () => {
		const h = harness(() => (
			<Chip label={label} iconRenderer={() => <Icon type="plusIcon" />} />
		));

		h.expect(
			template.prepend(':root', () => [
				<span classes={css.iconWrapper}>
					<Icon type="plusIcon" />
				</span>
			])
		);
	});

	it('should pass checked property to iconRenderer', () => {
		const h = harness(() => (
			<Chip
				label={label}
				checked={true}
				iconRenderer={(checked) => <span>{String(checked)}</span>}
			/>
		));

		h.expect(
			template.prepend(':root', () => [
				<span classes={css.iconWrapper}>
					<span>true</span>
				</span>
			])
		);
	});

	it('should render with a close icon when onClose is provided', () => {
		const h = harness(() => <Chip label={label} onClose={noop} />);
		h.expect(
			template.append(':root', () => [
				<span
					key="closeButton"
					classes={css.closeIconWrapper}
					tabIndex={0}
					role="button"
					onclick={noop}
					onkeydown={noop}
				>
					<Icon type="closeIcon" />
				</span>
			])
		);
	});

	it('should render with a closeRenderer when onClose is also provided', () => {
		const h = harness(() => (
			<Chip label={label} onClose={noop} closeRenderer={() => <Icon type="minusIcon" />} />
		));
		h.expect(
			template.append(':root', () => [
				<span
					key="closeButton"
					classes={css.closeIconWrapper}
					tabIndex={0}
					role="button"
					onclick={noop}
					onkeydown={noop}
				>
					<Icon type="minusIcon" />
				</span>
			])
		);
	});

	it('should not use a closeIconRenderer if provided without a callback', () => {
		const h = harness(() => <Chip label={label} closeRenderer={() => <span>Close</span>} />);

		h.expect(template);
	});

	it('should render with an iconRenderer and a close icon', () => {
		const h = harness(() => (
			<Chip label={label} onClose={noop} iconRenderer={() => <Icon type="plusIcon" />} />
		));

		h.expect(
			template
				.append(':root', () => [
					<span
						key="closeButton"
						classes={css.closeIconWrapper}
						tabIndex={0}
						role="button"
						onclick={noop}
						onkeydown={noop}
					>
						<Icon type="closeIcon" />
					</span>
				])
				.prepend(':root', () => [
					<span classes={css.iconWrapper}>
						<Icon type="plusIcon" />
					</span>
				])
		);
	});

	it('should add a clickable class and button attributes with an onClick callback', () => {
		const h = harness(() => <Chip label={label} onClick={noop} />);

		h.expect(
			template
				.setProperty(':root', 'classes', [css.root, undefined, css.clickable])
				.setProperty(':root', 'role', 'button')
				.setProperty(':root', 'tabIndex', 0)
		);
	});

	it('should add disabled class, and remove clickable class and button attributes if disabled', () => {
		const h = harness(() => <Chip label={label} onClick={noop} disabled />);

		h.expect(template.setProperty(':root', 'classes', [css.root, css.disabled, false]));
	});

	it('calls appropriate callbacks when clicked', () => {
		const onClose = sinon.spy();
		const onClick = sinon.spy();
		const h = harness(() => (
			<Chip
				label={label}
				onClose={onClose}
				onClick={onClick}
				iconRenderer={() => <Icon type="plusIcon" />}
			/>
		));

		h.expect(
			template
				.setProperty(':root', 'classes', [css.root, undefined, css.clickable])
				.setProperty(':root', 'role', 'button')
				.setProperty(':root', 'tabIndex', 0)
				.append(':root', () => [
					<span
						key="closeButton"
						classes={css.closeIconWrapper}
						tabIndex={0}
						role="button"
						onclick={noop}
						onkeydown={noop}
					>
						<Icon type="closeIcon" />
					</span>
				])
				.prepend(':root', () => [
					<span classes={css.iconWrapper}>
						<Icon type="plusIcon" />
					</span>
				])
		);

		const event = {
			stopPropagation: sinon.spy()
		};
		h.trigger('@closeButton', 'onclick', event as any);

		assert.isTrue(event.stopPropagation.calledOnce);
		assert.isTrue(onClose.calledOnce);
		assert.isTrue(onClick.notCalled);

		h.trigger('@root', 'onclick');

		assert.isTrue(event.stopPropagation.calledOnce);
		assert.isTrue(onClose.calledOnce);
		assert.isTrue(onClick.calledOnce);
	});

	it('calls appropriate callbacks when enter or space is pressed', () => {
		const onClose = sinon.spy();
		const onClick = sinon.spy();
		const h = harness(() => (
			<Chip
				label={label}
				onClose={onClose}
				onClick={onClick}
				iconRenderer={() => <Icon type="plusIcon" />}
			/>
		));

		h.expect(
			template
				.setProperty(':root', 'classes', [css.root, undefined, css.clickable])
				.setProperty(':root', 'role', 'button')
				.setProperty(':root', 'tabIndex', 0)
				.append(':root', () => [
					<span
						key="closeButton"
						classes={css.closeIconWrapper}
						tabIndex={0}
						role="button"
						onclick={noop}
						onkeydown={noop}
					>
						<Icon type="closeIcon" />
					</span>
				])
				.prepend(':root', () => [
					<span classes={css.iconWrapper}>
						<Icon type="plusIcon" />
					</span>
				])
		);

		[Keys.Enter, Keys.Space, Keys.Left].forEach((which) => {
			onClose.reset();
			onClick.reset();
			const closeEvent = {
				which,
				preventDefault: sinon.spy(),
				stopPropagation: sinon.spy()
			};
			h.trigger('@closeButton', 'onkeydown', closeEvent as any);

			if (Keys.Left === which) {
				assert.isTrue(closeEvent.stopPropagation.notCalled);
				assert.isTrue(closeEvent.preventDefault.notCalled);
				assert.isTrue(onClose.notCalled);
			} else {
				assert.isTrue(closeEvent.stopPropagation.calledOnce);
				assert.isTrue(closeEvent.preventDefault.calledOnce);
				assert.isTrue(onClose.calledOnce);
			}

			assert.isTrue(onClick.notCalled);

			const clickKeyEvent = {
				which,
				preventDefault: sinon.spy()
			};

			h.trigger('@root', 'onkeydown', clickKeyEvent as any);

			if (Keys.Left === which) {
				assert.isTrue(closeEvent.stopPropagation.notCalled);
				assert.isTrue(closeEvent.preventDefault.notCalled);
				assert.isTrue(onClose.notCalled);
				assert.isTrue(clickKeyEvent.preventDefault.notCalled);
				assert.isTrue(onClick.notCalled);
			} else {
				assert.isTrue(closeEvent.stopPropagation.calledOnce);
				assert.isTrue(closeEvent.preventDefault.calledOnce);
				assert.isTrue(onClose.calledOnce);
				assert.isTrue(clickKeyEvent.preventDefault.calledOnce);
				assert.isTrue(onClick.calledOnce);
			}
		});
	});
});
