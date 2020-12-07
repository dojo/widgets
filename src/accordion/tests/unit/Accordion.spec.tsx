const { describe, it } = intern.getInterface('bdd');
import * as themeCss from '../../../theme/default/accordion.m.css';
import Accordion from '../../index';
import TitlePane from '../../../title-pane';
import assertationTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';
import { compareTheme } from '../../../common/tests/support/test-helpers';

const noop = () => {};

describe('Accordion', () => {
	const baseTemplate = assertationTemplate(() => {
		return (
			<div classes={[undefined, themeCss.root]}>
				<TitlePane
					key="pane-0"
					onOpen={noop}
					onClose={noop}
					theme={{}}
					open={false}
					name="foo title"
					classes={undefined}
					variant={undefined}
				>
					foo content
				</TitlePane>
				<TitlePane
					key="pane-1"
					onOpen={noop}
					onClose={noop}
					theme={{}}
					open={false}
					name="bar title"
					classes={undefined}
					variant={undefined}
				>
					bar content
				</TitlePane>
			</div>
		);
	});

	it('renders closed panes', () => {
		const h = harness(
			() => (
				<Accordion panes={['foo title', 'bar title']}>
					{'foo content'}
					{'bar content'}
				</Accordion>
			),
			{ customComparator: [compareTheme] }
		);

		h.trigger('@pane-0', 'onOpen');
		h.trigger('@pane-1', 'onOpen');
		h.trigger('@pane-0', 'onClose');
		h.trigger('@pane-1', 'onClose');

		const testTemplate = baseTemplate
			.setProperty('@pane-0', 'onOpen', noop)
			.setProperty('@pane-0', 'onClose', noop)
			.setProperty('@pane-1', 'onOpen', noop)
			.setProperty('@pane-1', 'onClose', noop);

		h.expect(testTemplate);
	});

	it('renders open panes', () => {
		const h = harness(
			() => (
				<Accordion panes={['foo title', 'bar title']}>
					{'foo content'}
					{'bar content'}
				</Accordion>
			),
			{ customComparator: [compareTheme] }
		);

		h.trigger('@pane-0', 'onOpen');
		h.trigger('@pane-1', 'onOpen');

		const testTemplate = baseTemplate
			.setProperty('@pane-0', 'open', true)
			.setProperty('@pane-0', 'onOpen', noop)
			.setProperty('@pane-1', 'open', true)
			.setProperty('@pane-1', 'onOpen', noop);

		h.expect(testTemplate);
	});

	it('renders exclusive panes', () => {
		const h = harness(
			() => (
				<Accordion exclusive panes={['foo title', 'bar title']}>
					{'foo content'}
					{'bar content'}
				</Accordion>
			),
			{ customComparator: [compareTheme] }
		);

		h.trigger('@pane-0', 'onOpen');
		h.trigger('@pane-1', 'onOpen');

		const testTemplate = baseTemplate
			.setProperty('@pane-0', 'open', false)
			.setProperty('@pane-0', 'onOpen', noop)
			.setProperty('@pane-1', 'open', true)
			.setProperty('@pane-1', 'onOpen', noop);

		h.expect(testTemplate);
	});
});
