const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';
import HeaderCard from '../../index';
import Card from '../../../card';
import Avatar from '../../../avatar';
import * as css from '../../../theme/default/header-card.m.css';

describe('HeaderCard', () => {
	const template = assertionTemplate(() => (
		<Card key="root">
			{{
				header: (
					<div key="header" classes={css.header}>
						<div key="headerContent" classes={css.headerContent}>
							<h2 classes={css.title}>title</h2>
						</div>
					</div>
				)
			}}
		</Card>
	));

	it('renders', () => {
		const h = harness(() => <HeaderCard title="title" />);
		h.expect(template);
	});

	it('renders with a subtitle', () => {
		const h = harness(() => <HeaderCard title="title" subtitle="subtitle" />);
		h.expect(
			template.setChildren(
				'@root',
				() =>
					[
						{
							header: () => (
								<div key="header" classes={css.header}>
									<div key="headerContent" classes={css.headerContent}>
										{<h2 classes={css.title}>title</h2>}
										<h3 classes={css.subtitle}>subtitle</h3>
									</div>
								</div>
							)
						}
					] as any
			)
		);
	});

	it('renders with a an avatar', () => {
		const avatar = <Avatar>D</Avatar>;
		const h = harness(() => (
			<HeaderCard square title="title" subtitle="subtitle">
				{{ avatar }}
			</HeaderCard>
		));
		h.expect(
			template.setProperty('@root', 'square', true).setChildren(
				'@root',
				() =>
					[
						{
							header: () => (
								<div key="header" classes={css.header}>
									<div classes={css.avatar}>avatar</div>
									<div key="headerContent" classes={css.headerContent}>
										{<h2 classes={css.title}>title</h2>}
										<h3 classes={css.subtitle}>subtitle</h3>
									</div>
								</div>
							)
						}
					] as any
			)
		);
	});
});
