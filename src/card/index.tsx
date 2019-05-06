import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import { RenderResult } from '@dojo/framework/widget-core/interfaces';
import { alwaysRender } from '@dojo/framework/widget-core/decorators/alwaysRender';
import * as css from '../theme/card.m.css';

export interface CardProperties {
	actionsRenderer?(): RenderResult;
}

@alwaysRender()
export class Card extends WidgetBase<CardProperties> {
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
