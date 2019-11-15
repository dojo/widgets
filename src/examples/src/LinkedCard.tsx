import { Params } from '@dojo/framework/routing/interfaces';
import { tsx, create } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';

import * as css from './LinkedCard.m.css';
import { WNode } from '@dojo/framework/core/interfaces';
import Card, { CardProperties } from '@dojo/widgets/card';
import Link from '@dojo/framework/routing/Link';

export interface LinkedCardProperties extends CardProperties {
	url?: string;
	outlet?: string;
	params?: Params;
	header?: WNode;
	footer?: WNode;
}

const factory = create({ theme }).properties<LinkedCardProperties>();

export default factory(function LinkedCard({ middleware: { theme }, properties, children }) {
	const { url, outlet, params, header, footer, ...cardProperties } = properties();

	const card = (
		<Card {...cardProperties} classes={{ '@dojo/widgets/card': { root: [css.card] } }}>
			{header}
			<div key="content" data-test="content" classes={css.content}>
				{children()}
			</div>
			{footer}
		</Card>
	);

	if (url) {
		return (
			<div classes={css.root}>
				<a classes={css.link} href={url} target="_blank" rel="noopener noreferrer" />
				{card}
			</div>
		);
	}

	if (outlet) {
		return (
			<div classes={css.root}>
				<Link classes={css.link} to={outlet} params={params} />
				{card}
			</div>
		);
	}
	return card;
});
