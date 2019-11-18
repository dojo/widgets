import { Params } from '@dojo/framework/routing/interfaces';
import { tsx, create } from '@dojo/framework/core/vdom';

import * as css from './LinkedCard.m.css';
import Card, { CardProperties } from '@dojo/widgets/card';
import Link from '@dojo/framework/routing/Link';

export interface LinkedCardProperties extends CardProperties {
	outlet: string;
	params: Params;
}

const factory = create().properties<LinkedCardProperties>();

export default factory(function LinkedCard({ properties, children }) {
	const { outlet, params, ...cardProperties } = properties();

	const card = (
		<Card {...cardProperties} classes={{ '@dojo/widgets/card': { root: [css.card] } }}>
			<div key="content" classes={css.content}>
				{children()}
			</div>
		</Card>
	);

	return (
		<div classes={css.root}>
			<Link classes={css.link} to={outlet} params={params} />
			{card}
		</div>
	);
});
