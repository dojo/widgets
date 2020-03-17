import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '@dojo/framework/core/middleware/theme';
import * as css from '../theme/default/chip.m.css';
import Icon from '../icon/index';
import { Keys } from '../common/util';

export interface ChipProperties {
	/** Renders an icon, provided with the value of the checked property */
	iconRenderer?(checked?: boolean): RenderResult;
	/** The label to be displayed in the widget */
	label: string;
	/** Renders a close icon, ignored if `onClose` is not provided */
	closeRenderer?(): RenderResult;
	/** A callback when the close icon is clicked, if `closeRenderer` is not provided a default X icon will be used */
	onClose?(): void;
	/** An optional callback for the the widget is clicked */
	onClick?(): void;
	/** Whether the widget is disabled, only affects the widget when `onClick` is provided */
	disabled?: boolean;
	/** Indicates whe "checked" state of the widget, will be passed to the iconRenderer */
	checked?: boolean;
}

const factory = create({ theme }).properties<ChipProperties>();

export default factory(function Chip({ properties, middleware: { theme } }) {
	const {
		iconRenderer,
		label,
		closeRenderer,
		onClose,
		onClick,
		disabled,
		checked
	} = properties();
	const themedCss = theme.classes(css);

	const clickable = !disabled && onClick;
	return (
		<div
			key="root"
			classes={[
				themedCss.root,
				disabled && themedCss.disabled,
				clickable && themedCss.clickable
			]}
			role={clickable ? 'button' : undefined}
			onclick={() => {
				if (clickable && onClick) {
					onClick();
				}
			}}
			tabIndex={clickable ? 0 : undefined}
			onkeydown={(event) => {
				if (
					clickable &&
					onClick &&
					(event.which === Keys.Enter || event.which === Keys.Space)
				) {
					event.preventDefault();
					onClick();
				}
			}}
		>
			{iconRenderer && <span classes={themedCss.iconWrapper}>{iconRenderer(checked)}</span>}
			<span classes={themedCss.label}>{label}</span>
			{onClose && (
				<span
					key="closeButton"
					classes={themedCss.closeIconWrapper}
					tabIndex={0}
					role="button"
					onclick={(event) => {
						event.stopPropagation();
						onClose();
					}}
					onkeydown={(event) => {
						if (event.which === Keys.Enter || event.which === Keys.Space) {
							event.stopPropagation();
							event.preventDefault();
							onClose();
						}
					}}
				>
					{closeRenderer ? closeRenderer() : <Icon type="closeIcon" />}
				</span>
			)}
		</div>
	);
});
