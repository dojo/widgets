import { Keys } from '../../common/util';

const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';
import * as sinon from 'sinon';
import Chip from '../index';
import * as css from '../../theme/chip.m.css';
import Icon from '../../icon/index';

function noop() {}

describe('Chip', () => {
	const label = 'Chip label';
	const template = assertionTemplate(() => (
		<div
			key="root"
			classes={[css.root, undefined, undefined]}
			role={undefined}
			onclick={undefined}
			tabIndex={undefined}
			onkeydown={undefined}
		>
			<span classes={css.label}>{label}</span>
		</div>
	));

	it('should render with a label', () => {
		const h = harness(() => <Chip label={label} />);

		h.expect(template);
	});

	it('should render with an icon', () => {
		const h = harness(() => <Chip label={label} icon="plusIcon" />);

		h.expect(template.prepend(':root', () => [<Icon type="plusIcon" />]));
	});

	it('should render with a custom icon', () => {
		const h = harness(() => <Chip label={label} icon={<div>Some icon</div>} />);

		h.expect(template.prepend(':root', () => [<div>Some icon</div>]));
	});

	it('should render with a close icon when onClose is provided', () => {
		const h = harness(() => <Chip label={label} onClose={noop} />);
		h.expect(
			template.append(':root', () => [
				<span
					key="closeButton"
					classes={css.closeIcon}
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

	it('should render with a specific closeIcon when onClose is also provided', () => {
		const h = harness(() => <Chip label={label} onClose={noop} closeIcon="minusIcon" />);
		h.expect(
			template.append(':root', () => [
				<span
					key="closeButton"
					classes={css.closeIcon}
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

	it('should render with a vnode closeIcon when onClose is provided', () => {
		const h = harness(() => (
			<Chip label={label} onClose={noop} closeIcon={<div>Some close icon</div>} />
		));

		h.expect(
			template.append(':root', () => [
				<span
					key="closeButton"
					classes={css.closeIcon}
					tabIndex={0}
					role="button"
					onclick={noop}
					onkeydown={noop}
				>
					<div>Some close icon</div>
				</span>
			])
		);
	});

	it('should not render a closeIcon if provided without a callback', () => {
		const h = harness(() => <Chip label={label} closeIcon="minusIcon" />);

		h.expect(template);
	});

	it('should render with an icon and a closeIcon', () => {
		const h = harness(() => <Chip label={label} onClose={noop} icon="plusIcon" />);

		h.expect(
			template
				.append(':root', () => [
					<span
						key="closeButton"
						classes={css.closeIcon}
						tabIndex={0}
						role="button"
						onclick={noop}
						onkeydown={noop}
					>
						<Icon type="closeIcon" />
					</span>
				])
				.prepend(':root', () => [<Icon type="plusIcon" />])
		);
	});

	it('should add a clickable class and button attributes with an onClick callback', () => {
		const h = harness(() => <Chip label={label} onClick={noop} />);

		h.expect(
			template
				.setProperty(':root', 'classes', [css.root, undefined, css.clickable])
				.setProperty(':root', 'onclick', noop)
				.setProperty(':root', 'role', 'button')
				.setProperty(':root', 'tabIndex', 0)
				.setProperty(':root', 'onkeydown', noop)
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
			<Chip label={label} onClose={onClose} onClick={onClick} icon="plusIcon" />
		));

		h.expect(
			template
				.setProperty(':root', 'classes', [css.root, undefined, css.clickable])
				.setProperty(':root', 'onclick', noop)
				.setProperty(':root', 'role', 'button')
				.setProperty(':root', 'tabIndex', 0)
				.setProperty(':root', 'onkeydown', noop)
				.append(':root', () => [
					<span
						key="closeButton"
						classes={css.closeIcon}
						tabIndex={0}
						role="button"
						onclick={noop}
						onkeydown={noop}
					>
						<Icon type="closeIcon" />
					</span>
				])
				.prepend(':root', () => [<Icon type="plusIcon" />])
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
			<Chip label={label} onClose={onClose} onClick={onClick} icon="plusIcon" />
		));

		h.expect(
			template
				.setProperty(':root', 'classes', [css.root, undefined, css.clickable])
				.setProperty(':root', 'onclick', noop)
				.setProperty(':root', 'role', 'button')
				.setProperty(':root', 'tabIndex', 0)
				.setProperty(':root', 'onkeydown', noop)
				.append(':root', () => [
					<span
						key="closeButton"
						classes={css.closeIcon}
						tabIndex={0}
						role="button"
						onclick={noop}
						onkeydown={noop}
					>
						<Icon type="closeIcon" />
					</span>
				])
				.prepend(':root', () => [<Icon type="plusIcon" />])
		);

		[Keys.Enter, Keys.Space].forEach((which) => {
			onClose.reset();
			onClick.reset();
			const closeEvent = {
				which,
				preventDefault: sinon.spy(),
				stopPropagation: sinon.spy()
			};
			h.trigger('@closeButton', 'onkeydown', closeEvent as any);

			assert.isTrue(closeEvent.stopPropagation.calledOnce);
			assert.isTrue(closeEvent.preventDefault.calledOnce);
			assert.isTrue(onClose.calledOnce);
			assert.isTrue(onClick.notCalled);

			const clickKeyEvent = {
				which,
				preventDefault: sinon.spy()
			};

			h.trigger('@root', 'onkeydown', clickKeyEvent as any);

			assert.isTrue(closeEvent.stopPropagation.calledOnce);
			assert.isTrue(closeEvent.preventDefault.calledOnce);
			assert.isTrue(onClose.calledOnce);
			assert.isTrue(clickKeyEvent.preventDefault.calledOnce);
			assert.isTrue(onClick.calledOnce);
		});
	});
});
