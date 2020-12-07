import { DNode } from '@dojo/framework/core/interfaces';
import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { uuid } from '@dojo/framework/core/util';
import { create, tsx } from '@dojo/framework/core/vdom';
import { formatAriaProperties, Keys } from '../common/util';
import Icon from '../icon';
import theme from '../middleware/theme';
import bodyScroll from '../middleware/bodyScroll';
import * as css from '../theme/default/dialog.m.css';
import * as fixedCss from './styles/dialog.m.css';
import bundle from './nls/Dialog';
import GlobalEvent from '../global-event';
import inert from '@dojo/framework/core/middleware/inert';

export interface DialogPropertiesBase {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Determines whether the dialog can be closed */
	closeable?: boolean;
	/** Hidden text used by screen readers to display for the close button */
	closeText?: string;
	/** Determines whether the dialog is open or closed */
	open: boolean;
	/** Determines whether a semi-transparent background shows behind the dialog */
	underlay?: boolean;
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
	title?: DNode;
	content?: DNode;
	actions?: DNode;
}

export interface DialogState {
	wasOpen: boolean;
	callFocus: boolean;
	titleId: string;
	contentId: string;
}

const factory = create({
	theme,
	i18n,
	icache: createICacheMiddleware<DialogState>(),
	inert,
	bodyScroll
})
	.properties<DialogProperties>()
	.children<DialogChild>();
export const Dialog = factory(function Dialog({
	middleware: { theme, i18n, icache, inert, bodyScroll },
	properties,
	children
}) {
	const themeCss = theme.classes(css);

	let {
		open,
		aria = {},
		underlay,
		role = 'dialog',
		closeable = true,
		closeText,
		classes,
		theme: themeProp,
		variant
	} = properties();
	const [{ title, actions, content }] = children();
	const modal = role === 'alertdialog' || (properties() as DialogPropertiesDialogRole).modal;

	inert.set('dialog', open, true);

	if (!closeText) {
		const { messages } = i18n.localize(bundle);
		closeText = `${messages.close} ${title || ''}`;
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

	bodyScroll(!open);

	return (
		<body>
			<div
				key="dialog"
				classes={[theme.variant(), themeCss.root, open ? themeCss.open : null]}
			>
				{open && (
					<virtual>
						<GlobalEvent key="global" document={{ keyup }} />
						<div
							classes={[
								underlay ? themeCss.underlayVisible : null,
								fixedCss.underlay
							]}
							enterAnimation={themeCss.underlayEnter}
							exitAnimation={themeCss.underlayExit}
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
							classes={[themeCss.main, fixedCss.main]}
							enterAnimation={themeCss.enter}
							exitAnimation={themeCss.exit}
							key="main"
							role={role}
							tabIndex={-1}
							focus={callFocus}
						>
							<div classes={themeCss.title} key="title" id={titleId}>
								<div>{title}</div>
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
											<Icon
												theme={themeProp}
												classes={classes}
												variant={variant}
												type="closeIcon"
											/>
										</span>
									</button>
								)}
							</div>
							<div classes={themeCss.content} key="content" id={contentId}>
								{content}
							</div>
							{actions && (
								<div classes={themeCss.actions} key="actions">
									{actions}
								</div>
							)}
						</div>
					</virtual>
				)}
			</div>
		</body>
	);
});

export default Dialog;
