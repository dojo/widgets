const { registerSuite } = intern.getInterface('object');

import FloatingActionButton, { FloatingActionButtonPositions } from '../../index';
import * as buttonCss from '../../../theme/default/button.m.css';
import * as css from '../../../theme/default/floating-action-button.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import renderer, { assertion, wrap } from '@dojo/framework/testing/renderer';
import Button from '../../../button/index';
import { SupportedClassName } from '@dojo/framework/core/interfaces';
import { createTestTheme } from '../../../common/tests/support/test-helpers';

const WrappedButton = wrap(Button);
const theme = createTestTheme({ ...buttonCss, icon: css.icon, root: css.root });

const baseTemplate = assertion(() => (
	<WrappedButton
		theme={theme}
		classes={{
			'@dojo/widgets/button': {
				root: [false, false, undefined]
			}
		}}
	>
		{{
			label: (
				<virtual>
					<span aria="hidden" classes={css.effect} />
				</virtual>
			)
		}}
	</WrappedButton>
));

registerSuite('FloatingActionButton', {
	tests: {
		'no content'() {
			const r = renderer(() => <FloatingActionButton />);
			r.expect(baseTemplate);
		},

		'extended, properties, and attributes'() {
			const r = renderer(() => (
				<FloatingActionButton size="extended" type="submit" name="bar" disabled={true} />
			));
			r.expect(
				baseTemplate
					.setProperties(WrappedButton, {
						classes: {
							'@dojo/widgets/button': {
								root: [css.extended, false, undefined]
							}
						},
						disabled: true,
						name: 'bar',
						type: 'submit',
						theme
					})
					.replaceChildren(WrappedButton, () => ({
						label: (
							<virtual>
								<span aria="hidden" classes={css.effect} />
							</virtual>
						)
					}))
			);
		},

		small() {
			const r = renderer(() => (
				<FloatingActionButton size="small" type="submit" name="bar" disabled={true} />
			));
			r.expect(
				baseTemplate
					.setProperties(WrappedButton, {
						classes: {
							'@dojo/widgets/button': {
								root: [false, css.small, undefined]
							}
						},
						disabled: true,
						name: 'bar',
						type: 'submit',
						theme
					})
					.replaceChildren(WrappedButton, () => ({
						label: (
							<virtual>
								<span aria="hidden" classes={css.effect} />
							</virtual>
						)
					}))
			);
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
						const r = renderer(() => <FloatingActionButton position={position} />);
						r.expect(
							baseTemplate.setProperty(WrappedButton, 'classes', {
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
