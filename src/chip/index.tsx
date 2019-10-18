import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '@dojo/framework/core/middleware/theme';
import * as css from '../theme/chip.m.css';
import Icon from '../icon/index';
import { Keys } from '../common/util';

export interface ChipProperties {
	iconRenderer?(checked?: boolean): RenderResult;
	label: string;
	closeRenderer?(): RenderResult;
	onClose?(): void;
	onClick?(): void;
	disabled?: boolean;
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

	const createKeydown = (callback?: () => void) => (event: KeyboardEvent) => {
		if (callback && (event.which === Keys.Enter || event.which === Keys.Space)) {
			event.preventDefault();
			callback();
		}
	};

	const onCloseKeydown = createKeydown(onClose);

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
			onclick={clickable ? onClick : undefined}
			tabIndex={clickable ? 0 : undefined}
			onkeydown={clickable ? createKeydown(onClick) : undefined}
		>
			{iconRenderer && iconRenderer(checked)}
			<span classes={themedCss.label}>{label}</span>
			{onClose && (
				<span
					key="closeButton"
					classes={themedCss.closeIcon}
					tabIndex={0}
					role="button"
					onclick={(event) => {
						event.stopPropagation();
						onClose();
					}}
					onkeydown={(event) => {
						if (event.which === Keys.Enter || event.which === Keys.Space) {
							event.stopPropagation();
							onCloseKeydown(event);
						}
					}}
				>
					{closeRenderer ? closeRenderer() : <Icon type="closeIcon" />}
				</span>
			)}
		</div>
	);
});
