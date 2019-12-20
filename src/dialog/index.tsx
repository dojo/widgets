import { DNode } from '@dojo/framework/core/interfaces';
import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { uuid } from '@dojo/framework/core/util';
import { create, tsx } from '@dojo/framework/core/vdom';
import { formatAriaProperties, Keys } from '../common/util';
import Icon from '../icon';
import theme from '../middleware/theme';
import * as css from '../theme/default/dialog.m.css';
import * as fixedCss from './styles/dialog.m.css';
import commonBundle from '../common/nls/common';
import GlobalEvent from '../global-event';

export interface DialogPropertiesBase {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Determines whether the dialog can be closed */
	closeable?: boolean;
	/** Hidden text used by screen readers to display for the close button */
	closeText?: string;
	/** css class to be used when animating the dialog entering, or null to disable the animation */
	enterAnimation?: string | null;
	/** css class to be used when animating the dialog exiting, or null to disable the animation */
	exitAnimation?: string | null;
	/** Determines whether the dialog is open or closed */
	open: boolean;
	/** Determines whether a semi-transparent background shows behind the dialog */
	underlay?: boolean;
	/** css class to be used when animating the dialog underlay entering, or null to disable the animation */
	underlayEnterAnimation?: string | null;
	/** css class to be used when animating the dialog underlay exiting, or null to disable the animation */
	underlayExitAnimation?: string | null;
	/** Called when the dialog opens */
	onOpen?(): void;
	/** Called when the dialog is closed */
	onRequestClose(): void;
}

export interface DialogPropertiesDialogRole extends DialogPropertiesBase {
	/** Role of this dialog for accessibility, either 'alertdialog' or 'dialog' */
	role?: 'dialog';
	/** Determines whether the dialog can be closed by clicking outside its content. Only applicable when using "dialog" role */
	modal?: boolean;
}

export interface DialogPropertiesAlertDialogRole extends DialogPropertiesBase {
	role: 'alertdialog';
}

export type DialogProperties = DialogPropertiesDialogRole | DialogPropertiesAlertDialogRole;

export interface DialogChild {
	title?: () => DNode;
	content?: () => DNode;
}

export interface DialogState {
	wasOpen: boolean;
	callFocus: boolean;
	titleId: string;
	contentId: string;
}

const factory = create({ theme, i18n, icache: createICacheMiddleware<DialogState>() })
	.properties<DialogProperties>()
	.children<DialogChild>();
export const Dialog = factory(function Dialog({
	middleware: { theme, i18n, icache },
	properties,
	children
}) {
	const themeCss = theme.classes(css);

	let {
		open,
		aria = {},
		underlay,
		underlayEnterAnimation = themeCss.underlayEnter,
		underlayExitAnimation = themeCss.underlayExit,
		enterAnimation = themeCss.enter,
		exitAnimation = themeCss.exit,
		role = 'dialog',
		closeable = true,
		closeText
	} = properties();
	const [renderer] = children();
	const modal = role === 'alertdialog' || (properties() as DialogPropertiesDialogRole).modal;

	if (!closeText) {
		const { messages } = i18n.localize(commonBundle);
		closeText = `${messages.close} ${renderer.title ? renderer.title() : ''}`;
	}

	const wasOpen = icache.getOrSet('wasOpen', false);
	const titleId = icache.getOrSet('titleId', uuid());
	const contentId = icache.getOrSet('contentId', uuid());

	const onOpen = () => {
		const { onOpen } = properties();
		icache.set('callFocus', true);

		onOpen && onOpen();
	};

	const close = () => {
		const { closeable = true, onRequestClose } = properties();

		closeable && onRequestClose();
	};

	open && !wasOpen && onOpen();
	if (wasOpen !== open) {
		icache.set('wasOpen', open);
	}

	const callFocus = icache.getOrSet('callFocus', false);
	if (callFocus) {
		icache.set('callFocus', false);
	}

	const keyup = (event: KeyboardEvent) => {
		event.stopPropagation();
		if (event.which === Keys.Escape) {
			close();
		}
	};

	return (
		<div classes={[themeCss.root, open ? themeCss.open : null]}>
			{open && (
				<virtual>
					<GlobalEvent key="global" document={{ keyup }} />
					<div
						classes={[underlay ? themeCss.underlayVisible : null, fixedCss.underlay]}
						enterAnimation={underlayEnterAnimation}
						exitAnimation={underlayExitAnimation}
						key="underlay"
						onclick={(event) => {
							const { role } = properties();
							const modal =
								role === 'alertdialog' ||
								(properties() as DialogPropertiesDialogRole).modal;

							event.stopPropagation();
							!modal && close();
						}}
					/>
					<div
						aria-labelledby={titleId}
						aria-modal={modal ? 'true' : 'false'}
						aria-describedby={role === 'alertdialog' ? contentId : undefined}
						{...formatAriaProperties(aria)}
						classes={themeCss.main}
						enterAnimation={enterAnimation}
						exitAnimation={exitAnimation}
						key="main"
						role={role}
						tabIndex={-1}
						focus={callFocus}
					>
						<div classes={themeCss.title} key="title" id={titleId}>
							<div>{renderer.title && renderer.title()}</div>
							{closeable && (
								<button
									classes={themeCss.close}
									type="button"
									onclick={(event) => {
										event.stopPropagation();
										close();
									}}
								>
									{closeText}
									<span classes={themeCss.closeIcon}>
										<Icon type="closeIcon" />
									</span>
								</button>
							)}
						</div>
						<div classes={themeCss.content} key="content" id={contentId}>
							{renderer.content && renderer.content()}
						</div>
					</div>
				</virtual>
			)}
		</div>
	);
});

export default Dialog;
