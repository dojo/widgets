import { Keys } from '../../common/util';

const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';
import * as sinon from 'sinon';
import Chip from '../index';
import * as css from '../../theme/default/chip.m.css';
import Icon from '../../icon/index';

function noop() {}

const iconClasses = { '@dojo/widgets/icon': { icon: [css.icon] } };

describe('Chip', () => {
	const label = 'Chip label';
	const template = assertionTemplate(() => (
		<div
			key="root"
			classes={[undefined, css.root, undefined, undefined]}
			role={undefined}
			onclick={noop}
			tabIndex={undefined}
			onkeydown={noop}
		>
			<span classes={css.label}>{label}</span>
		</div>
	));

	it('should render with a label', () => {
		const h = harness(() => <Chip>{{ label }}</Chip>);

		h.expect(template);
	});

	it('should render with an icon renderer', () => {
		const h = harness(() => <Chip>{{ label, icon: () => <Icon type="plusIcon" /> }}</Chip>);

		h.expect(
			template.prepend(':root', () => [
				<span classes={css.iconWrapper}>
					<Icon type="plusIcon" />
				</span>
			])
		);
	});

	it('should pass checked property to icon', () => {
		const h = harness(() => (
			<Chip checked={true}>
				{{
					label,
					icon: (checked) => <span>{String(checked)}</span>
				}}
			</Chip>
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
		const h = harness(() => <Chip onClose={noop}>{{ label }}</Chip>);
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
					<Icon
						type="closeIcon"
						classes={iconClasses}
						variant={undefined}
						theme={undefined}
					/>
				</span>
			])
		);
	});

	it('should render with a closeRenderer when onClose is also provided', () => {
		const h = harness(() => (
			<Chip onClose={noop}>{{ label, closeIcon: <Icon type="minusIcon" /> }}</Chip>
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
		const h = harness(() => <Chip>{{ label, closeIcon: <span>Close</span> }}</Chip>);

		h.expect(template);
	});

	it('should render with an icon and a close icon', () => {
		const h = harness(() => (
			<Chip onClose={noop}>{{ label, icon: () => <Icon type="plusIcon" /> }}</Chip>
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
						<Icon
							type="closeIcon"
							classes={iconClasses}
							variant={undefined}
							theme={undefined}
						/>
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
		const h = harness(() => <Chip onClick={noop}>{{ label }}</Chip>);

		h.expect(
			template
				.setProperty(':root', 'classes', [undefined, css.root, undefined, css.clickable])
				.setProperty(':root', 'role', 'button')
				.setProperty(':root', 'tabIndex', 0)
		);
	});

	it('should add disabled class, and remove clickable class and button attributes if disabled', () => {
		const h = harness(() => (
			<Chip onClick={noop} disabled>
				{{ label }}
			</Chip>
		));

		h.expect(
			template.setProperty(':root', 'classes', [undefined, css.root, css.disabled, false])
		);
	});

	it('calls appropriate callbacks when clicked', () => {
		const onClose = sinon.spy();
		const onClick = sinon.spy();
		const h = harness(() => (
			<Chip onClose={onClose} onClick={onClick}>
				{{
					label,
					icon: () => <Icon type="plusIcon" classes={iconClasses} />
				}}
			</Chip>
		));

		h.expect(
			template
				.setProperty(':root', 'classes', [undefined, css.root, undefined, css.clickable])
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
						<Icon
							type="closeIcon"
							classes={iconClasses}
							variant={undefined}
							theme={undefined}
						/>
					</span>
				])
				.prepend(':root', () => [
					<span classes={css.iconWrapper}>
						<Icon type="plusIcon" classes={iconClasses} />
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

	it('does not trigger callback when disabled and clicked', () => {
		const onClick = sinon.spy();
		const h = harness(() => (
			<Chip disabled onClick={onClick}>
				{{ label }}
			</Chip>
		));

		h.expect(
			template.setProperty(':root', 'classes', [undefined, css.root, css.disabled, false])
		);

		h.trigger('@root', 'onclick');
		assert.isFalse(onClick.called);
	});

	it('calls appropriate callbacks when enter or space is pressed', () => {
		const onClose = sinon.spy();
		const onClick = sinon.spy();
		const h = harness(() => (
			<Chip onClose={onClose} onClick={onClick}>
				{{
					label,
					icon: () => <Icon type="plusIcon" classes={iconClasses} />
				}}
			</Chip>
		));

		h.expect(
			template
				.setProperty(':root', 'classes', [undefined, css.root, undefined, css.clickable])
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
						<Icon
							type="closeIcon"
							classes={iconClasses}
							variant={undefined}
							theme={undefined}
						/>
					</span>
				])
				.prepend(':root', () => [
					<span classes={css.iconWrapper}>
						<Icon type="plusIcon" classes={iconClasses} />
					</span>
				])
		);

		[Keys.Enter, Keys.Space, Keys.Left].forEach((which) => {
			onClose.resetHistory();
			onClick.resetHistory();
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
