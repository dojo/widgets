const { it, describe } = intern.getInterface('bdd');

import harness from '@dojo/framework/testing/harness/harness';
import * as css from '../../../theme/default/speed-dial.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';

import SpeedDial, { SpeedDialAction, SpeedDialIcon } from '../../index';
import Tooltip, { Orientation } from '../../../tooltip';
import FloatingActionButton from '../../../floating-action-button';
import * as fabCss from '../../../theme/default/floating-action-button.m.css';
import * as tooltipCss from '../../../theme/default/tooltip.m.css';
import { compareTheme, noop } from '../../../common/tests/support/test-helpers';

let clicked: string = '';
const actions: SpeedDialAction[] = [
	{
		tooltip: 'Tooltip 1',
		alwaysShowTooltip: true,
		label: 'Action 1',
		onAction: () => {
			clicked = 'Action 1';
		}
	},
	{
		tooltip: 'Tooltip 2',
		label: 'Action 2',
		onAction: () => {
			clicked = 'Action 2';
		}
	},
	{
		label: 'Action 3',
		onAction: () => {
			clicked = 'Action 3';
		}
	}
];
const baseTemplate = assertionTemplate(() => (
	<div
		key="root"
		classes={[undefined, css.root, false, css.right, false, false]}
		onpointerleave={noop}
	>
		<FloatingActionButton
			key="trigger"
			theme={{
				'@dojo/widgets/floating-action-button': fabCss
			}}
			onOver={noop}
		>
			<SpeedDialIcon assertion-key="speedDialIcon" open={undefined} />
		</FloatingActionButton>
		<div key="actions" classes={[css.actions, css.actionsClosed]}>
			<Tooltip
				assertion-key="tooltip-1"
				orientation={Orientation.left}
				open={true}
				theme={{
					'@dojo/widgets/tooltip': tooltipCss
				}}
				classes={{
					'@dojo/widgets/tooltip': {
						content: [css.staticTooltip, false, css.staticTooltipClosed, undefined]
					}
				}}
			>
				{{ content: undefined, trigger: undefined }}
			</Tooltip>
			<Tooltip
				assertion-key="tooltip-2"
				orientation={Orientation.left}
				open={false}
				theme={{
					'@dojo/widgets/tooltip': tooltipCss
				}}
				classes={{
					'@dojo/widgets/tooltip': {
						content: [css.staticTooltip, false, css.staticTooltipClosed, undefined]
					}
				}}
			>
				{{
					content: actions[0].tooltip,
					trigger: (
						<FloatingActionButton
							onOut={noop}
							onOver={noop}
							theme={{
								'@dojo/widgets/floating-action-button': fabCss
							}}
							classes={{
								'@dojo/widgets/floating-action-button': {
									root: [css.action, false, css.actionClosed, undefined]
								}
							}}
							size="small"
							onClick={noop}
						>
							{actions[1].label}
						</FloatingActionButton>
					)
				}}
			</Tooltip>
			<FloatingActionButton
				assertion-key="fab"
				onOut={noop}
				onOver={noop}
				theme={{
					'@dojo/widgets/floating-action-button': fabCss
				}}
				classes={{
					'@dojo/widgets/floating-action-button': {
						root: [css.action, false, css.actionClosed, undefined]
					}
				}}
				size="small"
				onClick={noop}
			>
				{actions[2].label}
			</FloatingActionButton>
		</div>
	</div>
));

describe('SpeedDial', () => {
	it('renders', () => {
		const h = harness(() => <SpeedDial actions={actions} />, [compareTheme]);
		h.expect(baseTemplate);
	});

	it('renders open', () => {
		const h = harness(() => <SpeedDial actions={actions} open={true} />, [compareTheme]);
		h.expect(
			baseTemplate
				.setProperty('@speedDialIcon', 'open', true)
				.setProperty('@actions', 'classes', [css.actions, false])
				.setProperty('@tooltip-1', 'classes', {
					'@dojo/widgets/tooltip': {
						content: [css.staticTooltip, false, false, undefined]
					}
				})
				.setProperty('@tooltip-2', 'classes', {
					'@dojo/widgets/tooltip': {
						content: [css.staticTooltip, false, false, undefined]
					}
				})
				.setProperty('@fab', 'classes', {
					'@dojo/widgets/floating-action-button': {
						root: [css.action, false, false, undefined]
					}
				})
		);
	});

	it('renders floating action buttons in tooltips', () => {
		const h = harness(() => <SpeedDial actions={actions} />, [compareTheme]);
		h.expect(baseTemplate);

		h.expect(
			() => (
				<FloatingActionButton
					onOut={noop}
					onOver={noop}
					theme={{
						'@dojo/widgets/floating-action-button': fabCss
					}}
					classes={{
						'@dojo/widgets/floating-action-button': {
							root: [css.action, false, css.actionClosed, undefined]
						}
					}}
					size="small"
					onClick={noop}
				>
					{actions[0].label}
				</FloatingActionButton>
			),
			() => h.trigger('@actions', (node: any) => () => node.children[0].children[0].trigger)
		);
	});

	it('shows tooltips when buttons are hovered', () => {
		const h = harness(() => <SpeedDial actions={actions} open={true} />, [compareTheme]);
		const openTemplate = baseTemplate
			.setProperty('@speedDialIcon', 'open', true)
			.setProperty('@actions', 'classes', [css.actions, false])
			.setProperty('@tooltip-1', 'classes', {
				'@dojo/widgets/tooltip': {
					content: [css.staticTooltip, false, false, undefined]
				}
			})
			.setProperty('@tooltip-2', 'classes', {
				'@dojo/widgets/tooltip': {
					content: [css.staticTooltip, false, false, undefined]
				}
			})
			.setProperty('@fab', 'classes', {
				'@dojo/widgets/floating-action-button': {
					root: [css.action, false, false, undefined]
				}
			});
		h.expect(openTemplate);
		h.trigger(
			'@actions',
			(node: any) => node.children[1].children[0].trigger.properties.onOver
		);
		h.expect(openTemplate.setProperty('@tooltip-2', 'open', true));
		h.trigger('@actions', (node: any) => node.children[1].children[0].trigger.properties.onOut);
		h.expect(openTemplate);
	});

	it('shows animations when transitioning', () => {
		const h = harness(() => <SpeedDial actions={actions} />, [compareTheme]);
		const openTemplate = baseTemplate
			.setProperty('@speedDialIcon', 'open', true)
			.setProperty('@actions', 'classes', [css.actions, false])
			.setProperty('@tooltip-1', 'classes', {
				'@dojo/widgets/tooltip': {
					content: [css.staticTooltip, css.actionTransition, false, undefined]
				}
			})
			.setProperty('@tooltip-2', 'classes', {
				'@dojo/widgets/tooltip': {
					content: [css.staticTooltip, css.actionTransition, false, css.action4]
				}
			})
			.setProperty('@fab', 'classes', {
				'@dojo/widgets/floating-action-button': {
					root: [css.action, css.actionTransition, false, css.action3]
				}
			});
		h.expect(baseTemplate);
		h.trigger('@trigger', 'onOver');
		h.expect(openTemplate);
		h.trigger('@root', 'onpointerleave');
		h.expect(
			baseTemplate
				.setProperty('@tooltip-1', 'classes', {
					'@dojo/widgets/tooltip': {
						content: [
							css.staticTooltip,
							css.actionTransition,
							css.staticTooltipClosed,
							css.action3
						]
					}
				})
				.setProperty('@tooltip-2', 'classes', {
					'@dojo/widgets/tooltip': {
						content: [
							css.staticTooltip,
							css.actionTransition,
							css.staticTooltipClosed,
							css.action4
						]
					}
				})
				.setProperty('@fab', 'classes', {
					'@dojo/widgets/floating-action-button': {
						root: [css.action, css.actionTransition, css.actionClosed, undefined]
					}
				})
				.setProperty('@speedDialIcon', 'open', false)
		);
	});
});
