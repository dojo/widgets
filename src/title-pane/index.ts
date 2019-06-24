import { uuid } from '@dojo/framework/core/util';
import { DNode } from '@dojo/framework/core/interfaces';
import { theme, ThemedMixin, ThemedProperties } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { v, w } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';

import Icon from '../icon/index';
import * as fixedCss from './styles/title-pane.m.css';
import * as css from '../theme/title-pane.m.css';
import { Dimensions } from '@dojo/framework/core/meta/Dimensions';
import { customElement } from '@dojo/framework/core/decorators/customElement';
import GlobalEvent from '../global-event/index';

/**
 * @type TitlePaneProperties
 *
 * Properties that can be set on a TitlePane component
 *
 * @property closeable          If false the pane will not collapse in response to clicking the title
 * @property headingLevel       'aria-level' for the title's DOM node
 * @property onRequestClose     Called when the title of an open pane is clicked
 * @property onRequestOpen      Called when the title of a closed pane is clicked
 * @property open               If true the pane is opened and content is visible
 * @property title              Title to display above the content
 */
export interface TitlePaneProperties extends ThemedProperties, FocusProperties {
	closeable?: boolean;
	headingLevel?: number;
	onRequestClose?(key: string | number | undefined): void;
	onRequestOpen?(key: string | number | undefined): void;
	open?: boolean;
	title: string;
}

@theme(css)
@customElement<TitlePaneProperties>({
	tag: 'dojo-title-pane',
	properties: ['theme', 'classes', 'extraClasses', 'open', 'closeable', 'headingLevel'],
	attributes: ['title', 'key'],
	events: ['onRequestClose', 'onRequestOpen']
})
export class TitlePane extends ThemedMixin(FocusMixin(WidgetBase))<TitlePaneProperties> {
	private _id = uuid();
	private _open: boolean | undefined;

	private _onWindowResize = () => {
		this.invalidate();
	};

	private _onTitleClick(event: MouseEvent) {
		event.stopPropagation();
		this._toggle();
	}

	private _toggle() {
		const {
			closeable = true,
			key,
			onRequestClose,
			onRequestOpen,
			open = true
		} = this.properties;

		if (!closeable) {
			return;
		}

		if (open) {
			onRequestClose && onRequestClose(key);
		} else {
			onRequestOpen && onRequestOpen(key);
		}
	}

	protected getButtonContent(): DNode {
		return this.properties.title;
	}

	protected getFixedModifierClasses(): (string | null)[] {
		const { closeable = true } = this.properties;
		return [closeable ? fixedCss.closeableFixed : null];
	}

	protected getModifierClasses(): (string | null)[] {
		const { closeable = true } = this.properties;
		return [closeable ? css.closeable : null];
	}

	protected getPaneContent(): DNode[] {
		return this.children;
	}

	protected renderExpandIcon(): DNode {
		const { open = true, theme, classes } = this.properties;
		return v('span', { classes: this.theme(css.arrow) }, [
			w(Icon, { type: open ? 'downIcon' : 'rightIcon', theme, classes })
		]);
	}

	protected getPaneStyles(): any {
		const { open = true } = this.properties;
		const contentDimensions = this.meta(Dimensions).get('content');
		return { marginTop: open ? '0px' : `-${contentDimensions.offset.height}px` };
	}

	protected render(): DNode {
		const { closeable = true, headingLevel, open = true } = this.properties;

		let transition = false;

		if (open !== this._open) {
			transition = true;
			this._open = open;
		}

		return v(
			'div',
			{
				classes: [...this.theme([css.root, open ? css.open : null]), fixedCss.rootFixed]
			},
			[
				w(GlobalEvent, { key: 'global', window: { resize: this._onWindowResize } }),
				v(
					'div',
					{
						'aria-level': headingLevel ? `${headingLevel}` : null,
						classes: [
							...this.theme([css.title, ...this.getModifierClasses()]),
							fixedCss.titleFixed,
							...this.getFixedModifierClasses()
						],
						role: 'heading'
					},
					[
						v(
							'button',
							{
								'aria-controls': `${this._id}-content`,
								'aria-expanded': `${open}`,
								disabled: !closeable,
								classes: [
									fixedCss.titleButtonFixed,
									...this.theme([css.titleButton])
								],
								focus: this.shouldFocus,
								id: `${this._id}-title`,
								type: 'button',
								onclick: this._onTitleClick
							},
							[this.renderExpandIcon(), this.getButtonContent()]
						)
					]
				),
				v(
					'div',
					{
						'aria-hidden': open ? null : 'true',
						'aria-labelledby': `${this._id}-title`,
						classes: [
							...this.theme([css.content, transition ? css.contentTransition : null]),
							fixedCss.contentFixed
						],
						id: `${this._id}-content`,
						key: 'content',
						styles: this.getPaneStyles()
					},
					this.getPaneContent()
				)
			]
		);
	}
}

export default TitlePane;
