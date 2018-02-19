import uuid from '@dojo/core/uuid';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin, ThemedProperties } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import WebAnimation from '@dojo/widget-core/meta/WebAnimation';

import * as fixedCss from './styles/titlePane.m.css';
import * as css from '../theme/titlepane/titlePane.m.css';
import * as iconCss from '../theme/common/icons.m.css';
import { Dimensions } from '@dojo/widget-core/meta/Dimensions';
import { customElement } from '@dojo/widget-core/decorators/customElement';
import { GlobalEvent } from '../global-event/GlobalEvent';

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
export interface TitlePaneProperties extends ThemedProperties {
	closeable?: boolean;
	headingLevel?: number;
	onRequestClose?(key: string | number | undefined): void;
	onRequestOpen?(key: string | number | undefined): void;
	open?: boolean;
	title: string;
};

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@theme(iconCss)
@customElement<TitlePaneProperties>({
	tag: 'dojo-title-pane',
	properties: [ 'theme', 'extraClasses', 'open', 'closeable', 'headingLevel' ],
	attributes: [ 'title' ],
	events: [
		'onRequestClose',
		'onRequestOpen'
	]
})
export class TitlePaneBase<P extends TitlePaneProperties = TitlePaneProperties> extends ThemedBase<P> {
	private _id = uuid();
	private _open: boolean;

	private _onWindowResize = () => {
		this.invalidate();
	}

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
		}
		else {
			onRequestOpen && onRequestOpen(key);
		}
	}

	protected animate(effects: any[]) {
		const { open = true } = this.properties;
		this.meta(WebAnimation).animate('content', {
			id: this._id,
			effects,
			timing: {
				duration: 250,
				fill: 'both'
			},
			controls: {
				play: true,
				playbackRate: open ? -1 : 1
			}
		});
	}

	protected getAnimationKeyframes(): any[] {
		const contentDimensions = this.meta(Dimensions).get('content');
		return [
			{ marginTop: '0px' },
			{ marginTop: `-${ contentDimensions.offset.height }px` }
		];
	}

	protected getButtonContent(): DNode {
		return this.properties.title;
	}

	protected getFixedModifierClasses(): (string | null)[] {
		const { closeable = true } = this.properties;
		return [
			closeable ? fixedCss.closeableFixed : null
		];
	}

	protected getModifierClasses(): (string | null)[] {
		const { closeable = true } = this.properties;
		return [
			closeable ? css.closeable : null
		];
	}

	protected getPaneContent(): DNode[] {
		return this.children;
	}

	protected renderExpandIcon(): DNode {
		const { open = true } = this.properties;
		return v('i', {
			classes: this.theme([
				css.arrow,
				iconCss.icon,
				open ? iconCss.downIcon : iconCss.rightIcon
			]),
			role: 'presentation',
			'aria-hidden': 'true'
		});
	}

	protected render(): DNode {
		const {
			closeable = true,
			headingLevel,
			open = true
		} = this.properties;
		const effects = this.getAnimationKeyframes();

		if (open !== this._open) {
			this.animate(effects);
			this._open = open;
		}

		return v('div', {
			classes: [ ...this.theme([
				css.root,
				open ? css.open : null
			]), fixedCss.rootFixed ]
		}, [
			w(GlobalEvent, { key: 'global', window: { resize: this._onWindowResize } }),
			v('div', {
				'aria-level': headingLevel ? `${headingLevel}` : null,
				classes: [ ...this.theme([ css.title, ...this.getModifierClasses() ]), fixedCss.titleFixed, ...this.getFixedModifierClasses() ],
				role: 'heading'
			}, [
				v('button', {
					'aria-controls': `${this._id}-content`,
					'aria-expanded': `${open}`,
					disabled: !closeable,
					classes: this.theme(css.titleButton),
					id: `${this._id}-title`,
					type: 'button',
					onclick: this._onTitleClick
				}, [
					this.renderExpandIcon(),
					this.getButtonContent()
				])
			]),
			v('div', {
				'aria-hidden': open ? null : 'true',
				'aria-labelledby': `${this._id}-title`,
				classes: [ this.theme(css.content), fixedCss.contentFixed ],
				id: `${this._id}-content`,
				key: 'content',
				styles: open ? effects[0] : effects[effects.length - 1]
			}, this.getPaneContent())
		]);
	}
}

export default class TitlePane extends TitlePaneBase<TitlePaneProperties> {}
