const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';

import * as css from '../../theme/default/breadcrumb.m.css';
import Crumb from '../Crumb';
import * as fixedCss from '../styles/breadcrumb.m.css';
import Breadcrumb from '../index';

describe('Breadcrumb', () => {
	const textSeparatorItemStyles = [fixedCss.listItemFixed, css.listItem, undefined];
	const currentTextSeparatorItemStyles = [fixedCss.listItemFixed, css.listItem, css.current];

	const baseTemplate = assertionTemplate(() => (
		<nav assertion-key="root" classes={css.root} aria-label="breadcrumb">
			<ol classes={[fixedCss.listFixed, css.list]}>
				<li classes={textSeparatorItemStyles} key="breadcrumb-0">
					<Crumb item={{ label: 'Home' }} current={undefined} />
				</li>
				<li classes={textSeparatorItemStyles} key="breadcrumb-1">
					<Crumb item={{ label: 'Overview' }} current={undefined} />
				</li>
				<li classes={currentTextSeparatorItemStyles} key="breadcrumb-2">
					<Crumb item={{ label: 'Tests' }} current="page" />
				</li>
			</ol>
		</nav>
	));

	it('renders with items', () => {
		const h = harness(() => (
			<Breadcrumb
				label="breadcrumb"
				items={[{ label: 'Home' }, { label: 'Overview' }, { label: 'Tests' }]}
			/>
		));

		h.expect(baseTemplate);
	});

	it('renders with a custom child renderer', () => {
		const h = harness(() => (
			<Breadcrumb
				label="breadcrumb"
				items={[
					{ label: 'Home', href: '/' },
					{ label: 'Overview', href: '/overview', title: 'Breadcrumb Overview' },
					{ href: '/tests', label: 'Tests' }
				]}
			>
				{(items) => (
					<ol>
						{items.map((item, i) => (
							<li key={`crumb-${i}`}>
								<a
									aria-current={i === 1 ? 'page' : undefined}
									href={item.href}
									title={item.title}
								>
									{item.label}
								</a>
							</li>
						))}
					</ol>
				)}
			</Breadcrumb>
		));

		h.expect(
			baseTemplate.setChildren('~root', () => [
				<ol>
					<li key="crumb-0">
						<a aria-current={undefined} href="/" title={undefined}>
							Home
						</a>
					</li>
					<li key="crumb-1">
						<a aria-current="page" href="/overview" title="Breadcrumb Overview">
							Overview
						</a>
					</li>
					<li key="crumb-2">
						<a aria-current={undefined} href="/tests" title={undefined}>
							Tests
						</a>
					</li>
				</ol>
			])
		);
	});
});
