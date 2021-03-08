const { registerSuite } = intern.getInterface('object');

import harness from '@dojo/framework/testing/harness/harness';

import FloatingActionButton, { FloatingActionButtonPositions } from '../../index';
import * as buttonCss from '../../../theme/default/button.m.css';
import * as css from '../../../theme/default/floating-action-button.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import Button from '../../../button/index';
import { compareTheme } from '../../../common/tests/support/test-helpers';
import { SupportedClassName } from '@dojo/framework/core/interfaces';

const baseTemplate = assertionTemplate(() => (
	<Button
		assertion-key="button"
		theme={{ '@dojo/widgets/button': buttonCss }}
		classes={{
			'@dojo/widgets/button': {
				root: [false, false, undefined]
			}
		}}
	>
		<span aria="hidden" classes={css.effect} />
	</Button>
));

registerSuite('FloatingActionButton', {
	tests: {
		'no content'() {
			const h = harness(() => <FloatingActionButton />, [compareTheme]);
			h.expect(baseTemplate);
		},

		'extended, properties, and attributes'() {
			const h = harness(
				() => (
					<FloatingActionButton
						size="extended"
						type="submit"
						name="bar"
						disabled={true}
					/>
				),
				[compareTheme]
			);
			h.expect(() => (
				<Button
					theme={{ '@dojo/widgets/button': buttonCss }}
					classes={{
						'@dojo/widgets/button': {
							root: [css.extended, false, undefined]
						}
					}}
					type="submit"
					name="bar"
					disabled={true}
				>
					<span aria="hidden" classes={css.effect} />
				</Button>
			));
		},

		small() {
			const h = harness(
				() => (
					<FloatingActionButton size="small" type="submit" name="bar" disabled={true} />
				),
				[compareTheme]
			);
			h.expect(() => (
				<Button
					theme={{ '@dojo/widgets/button': buttonCss }}
					classes={{
						'@dojo/widgets/button': {
							root: [false, css.small, undefined]
						}
					}}
					type="submit"
					name="bar"
					disabled={true}
				>
					<span aria="hidden" classes={css.effect} />
				</Button>
			));
		},

		position: (() => {
			const positionTestCases: {
				position: FloatingActionButtonPositions;
				positionClass: SupportedClassName;
			}[] = [
				{
					position: 'bottom-right',
					positionClass: css.bottomRight
				},
				{
					position: 'bottom-center',
					positionClass: css.bottomCenter
				},
				{
					position: 'bottom-left',
					positionClass: css.bottomLeft
				},
				{
					position: 'left-center',
					positionClass: css.leftCenter
				},
				{
					position: 'right-center',
					positionClass: css.rightCenter
				},
				{
					position: 'top-right',
					positionClass: css.topRight
				},
				{
					position: 'top-center',
					positionClass: css.topCenter
				},
				{
					position: 'top-left',
					positionClass: css.topLeft
				}
			];
			return positionTestCases.reduce(
				(testObject, { position, positionClass }) => ({
					...testObject,
					[position]: () => {
						const h = harness(() => <FloatingActionButton position={position} />, [
							compareTheme
						]);
						h.expect(
							baseTemplate.setProperty('~button', 'classes', {
								'@dojo/widgets/button': {
									root: [false, false, positionClass]
								}
							})
						);
					}
				}),
				{} as Record<string, () => void>
			);
		})()
	}
});
