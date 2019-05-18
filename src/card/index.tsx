import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import { RenderResult } from '@dojo/framework/widget-core/interfaces';
import { alwaysRender } from '@dojo/framework/widget-core/decorators/alwaysRender';
import { ThemedMixin, theme } from '@dojo/framework/widget-core/mixins/Themed';
import * as css from '../theme/card.m.css';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';

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
	protected render() {
		const { actionsRenderer } = this.properties;
		const actionsResult = actionsRenderer && actionsRenderer();
		return (
			<div key="root" classes={[css.root]}>
				{this.children}
				{actionsResult && <div classes={css.actions}>{actionsResult}</div>}
			</div>
		);
	}
}

export default Card;
