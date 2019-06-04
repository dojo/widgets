import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { alwaysRender } from '@dojo/framework/core/decorators/alwaysRender';
import { ThemedMixin, theme } from '@dojo/framework/core/mixins/Themed';
import * as css from '../theme/card.m.css';
import { customElement } from '@dojo/framework/core/decorators/customElement';
import { DNode } from '@dojo/framework/core/interfaces';

export interface CardProperties {
	actionsRenderer?(): RenderResult;
}

@customElement<CardProperties>({
	tag: 'dojo-card',
	properties: ['actionsRenderer']
})
@theme(css)
@alwaysRender()
export class Card extends ThemedMixin(WidgetBase)<CardProperties> {
	protected render(): DNode {
		const { actionsRenderer } = this.properties;
		const actionsResult = actionsRenderer && actionsRenderer();
		return (
			<div key="root" classes={css.root}>
				{this.children}
				{actionsResult && <div classes={css.actions}>{actionsResult}</div>}
			</div>
		);
	}
}

export default Card;
