const { describe, it } = intern.getInterface('bdd');
import * as fixedCss from '../../styles/title-pane.m.css';
import * as themeCss from '../../../theme/default/title-pane.m.css';
import Icon from '../../../icon';
import TitlePane, { TitlePaneProperties } from '../../index';
import assertationTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';

const noop = () => {};

describe('TitlePane', () => {
	function getTemplate({
		closeable = true,
		headingLevel,
		initialOpen: open
	}: TitlePaneProperties = {}) {
		return assertationTemplate(() => {
			return (
				<div classes={[themeCss.root, open ? themeCss.open : null, fixedCss.rootFixed]}>
					<div
						aria-level={headingLevel ? `${headingLevel}` : null}
						classes={[
							themeCss.title,
							closeable ? themeCss.closeable : null,
							fixedCss.titleFixed,
							closeable ? fixedCss.closeableFixed : null
						]}
						role="heading"
					>
						<button
							aria-controls="test-content"
							aria-expanded={`${open}`}
							disabled={!closeable}
							classes={[fixedCss.titleButtonFixed, themeCss.titleButton]}
							focus={false}
							key="title-button"
							onclick={noop}
							type="button"
						>
							<span classes={themeCss.arrow}>
								<Icon type={open ? 'downIcon' : 'rightIcon'} theme={undefined} />
							</span>
							title
						</button>
					</div>
					<div
						aria-hidden={open ? null : 'true'}
						aria-labelledby="test-title"
						classes={[
							themeCss.content,
							open ? themeCss.contentTransition : null,
							fixedCss.contentFixed
						]}
						id="test-content"
						key="content"
						styles={{
							marginTop: open ? '0px' : `-0px`
						}}
					>
						content
					</div>
				</div>
			);
		});
	}

	it('renders closed', () => {
		const h = harness(() => (
			<TitlePane>
				{{
					title: () => 'title',
					content: () => 'content'
				}}
			</TitlePane>
		));
		h.expect(getTemplate());
	});

	it('renders open', () => {
		const h = harness(() => (
			<TitlePane initialOpen>
				{{
					title: () => 'title',
					content: () => 'content'
				}}
			</TitlePane>
		));
		h.expect(
			getTemplate({
				initialOpen: true
			})
		);
	});

	it('renders heading level', () => {
		const h = harness(() => (
			<TitlePane headingLevel={3}>
				{{
					title: () => 'title',
					content: () => 'content'
				}}
			</TitlePane>
		));
		h.expect(
			getTemplate({
				headingLevel: 3
			})
		);
	});

	it('renders not closeable', () => {
		const h = harness(() => (
			<TitlePane closeable={false}>
				{{
					title: () => 'title',
					content: () => 'content'
				}}
			</TitlePane>
		));
		h.expect(
			getTemplate({
				closeable: false
			})
		);
	});
});
