import { create, isVNode, isWNode, tsx } from '@dojo/framework/core/vdom';
import { VNode, WNode } from '@dojo/framework/core/interfaces';
import theme from '@dojo/framework/core/middleware/theme';
import * as css from '../theme/chip.m.css';
import Icon, { IconType } from '../icon/index';
import { Keys } from '../common/util';

export interface ChipProperties {
	icon?: WNode | VNode | IconType;
	label: string;
	closeIcon?: WNode | VNode | IconType;
	onClose?(): void;
	onClick?(): void;
	disabled?: boolean;
}

const factory = create({ theme }).properties<ChipProperties>();

export default factory(function Chip({ properties, middleware: { theme } }) {
	const { icon, label, closeIcon, onClose, onClick, disabled } = properties();
	const themedCss = theme.classes(css);

	const createKeydown = (callback?: () => void) => (event: KeyboardEvent) => {
		if (callback && (event.which === Keys.Enter || event.which === Keys.Space)) {
			event.preventDefault();
			callback();
		}
	};

	const clickable = !disabled && onClick;
	return (
		<div
			classes={[
				themedCss.root,
				disabled && themedCss.disabled,
				clickable && themedCss.clickable
			]}
			role={clickable ? 'button' : undefined}
			onclick={clickable ? onClick : undefined}
			tabIndex={clickable ? 0 : undefined}
			onkeydown={clickable ? createKeydown(onClick) : undefined}
		>
			{!icon || isVNode(icon) || isWNode(icon) ? icon : <Icon type={icon} />}
			<span classes={themedCss.label}>{label}</span>
			{onClose && (
				<span
					classes={themedCss.closeIcon}
					tabIndex={0}
					role="button"
					onclick={(event) => {
						event.stopPropagation();
						onClose();
					}}
					onkeydown={createKeydown(onClose)}
				>
					{isVNode(closeIcon) || isWNode(closeIcon) ? (
						closeIcon
					) : (
						<Icon type={closeIcon || 'closeIcon'} />
					)}
				</span>
			)}
		</div>
	);
});
