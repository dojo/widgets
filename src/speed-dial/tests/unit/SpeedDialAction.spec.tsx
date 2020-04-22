const { it, describe } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';

import * as sinon from 'sinon';
import { SpeedDialAction } from '../../index';
import Tooltip, { Orientation } from '../../../tooltip';
import FloatingActionButton from '../../../floating-action-button';
import * as fabCss from '../../../theme/default/floating-action-button.m.css';
import { compareTheme, noop } from '../../../common/tests/support/test-helpers';

const icon = <div>Icon</div>;
const baseTemplate = assertionTemplate(() => (
	<FloatingActionButton
		key="button"
		size="small"
		theme={{
			'@dojo/widgets/floating-action-button': fabCss
		}}
		onOver={noop}
		onOut={noop}
		onClick={noop}
	>
		{icon}
	</FloatingActionButton>
));
const tooltipTemplate = assertionTemplate(() => (
	<Tooltip open={undefined} orientation={undefined}>
		{{
			trigger: (
				<FloatingActionButton
					key="button"
					size="small"
					theme={{
						'@dojo/widgets/floating-action-button': fabCss
					}}
					onOver={noop}
					onOut={noop}
					onClick={noop}
				>
					{icon}
				</FloatingActionButton>
			),
			content: 'tooltip'
		}}
	</Tooltip>
));

describe('SpeedDialAction', () => {
	it('renders', () => {
		const h = harness(() => <SpeedDialAction onAction={noop}>{{ icon }}</SpeedDialAction>, [
			compareTheme
		]);
		h.expect(baseTemplate);
	});

	it('renders with a tooltip', () => {
		const h = harness(
			() => (
				<SpeedDialAction onAction={noop}>
					{{
						icon,
						tooltip: 'tooltip'
					}}
				</SpeedDialAction>
			),
			[compareTheme]
		);
		h.expect(tooltipTemplate);
	});

	it('opens', () => {
		const h = harness(
			() => (
				<SpeedDialAction onAction={noop}>
					{{
						icon,
						tooltip: 'tooltip'
					}}
				</SpeedDialAction>
			),
			[compareTheme]
		);
		h.expect(tooltipTemplate);
		h.trigger(':root', (node: any) => node.children[0].trigger.properties.onOver);
		h.expect(tooltipTemplate.setProperty(':root', 'open', true));
		h.trigger(':root', (node: any) => node.children[0].trigger.properties.onOut);
		h.expect(tooltipTemplate.setProperty(':root', 'open', false));
	});

	it('renders forced open', () => {
		const h = harness(
			() => (
				<SpeedDialAction onAction={noop} tooltipOpen={true}>
					{{
						icon,
						tooltip: 'tooltip'
					}}
				</SpeedDialAction>
			),
			[compareTheme]
		);
		h.expect(tooltipTemplate.setProperty(':root', 'open', true));
	});

	it('renders with a different orientation', () => {
		const h = harness(
			() => (
				<SpeedDialAction onAction={noop} tooltipOrientation={Orientation.bottom}>
					{{
						icon,
						tooltip: 'tooltip'
					}}
				</SpeedDialAction>
			),
			[compareTheme]
		);
		h.expect(tooltipTemplate.setProperty(':root', 'orientation', Orientation.bottom));
	});

	it('triggers action callback when clicked', () => {
		const onAction = sinon.spy();
		const h = harness(() => <SpeedDialAction onAction={onAction}>{{ icon }}</SpeedDialAction>, [
			compareTheme
		]);
		h.trigger('@button', 'onClick');
		assert.isTrue(onAction.calledOnce);
	});
});
