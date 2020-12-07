const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import renderer, { assertion, wrap } from '@dojo/framework/testing/renderer';

import Rate from '../index';
import RadioGroup from '../../radio-group';

import * as fixedCss from '../rate.m.css';
import * as css from '../../theme/default/rate.m.css';
import * as baseCss from '../../common/styles/base.m.css';

import { Icon } from '../../icon';
import { noop } from '../../common/tests/support/test-helpers';

function createMockRadioGroupMiddleware(checkedValue: string) {
	return (value?: string) => {
		return {
			checked: () => {
				return value === checkedValue;
			}
		};
	};
}

const baseOptions = [
	{ value: '1' },
	{ value: '2' },
	{ value: '3' },
	{ value: '4' },
	{ value: '5' }
];

describe('Rate', () => {
	const WrappedRadioGroup = wrap(RadioGroup);
	const WrappedRootNode = wrap('div');

	const baseAssertion = assertion(() => (
		<WrappedRootNode classes={[css.root, undefined, false]}>
			<WrappedRadioGroup
				key="radio-group"
				name={'test'}
				options={baseOptions}
				onValue={noop}
				theme={undefined}
				variant={undefined}
				classes={undefined}
			>
				{{
					label: 'test',
					radios: () => []
				}}
			</WrappedRadioGroup>
		</WrappedRootNode>
	));

	it('Renders', () => {
		const r = renderer(() => (
			<Rate name="test">
				{{
					label: 'test'
				}}
			</Rate>
		));

		r.expect(baseAssertion);
	});

	it('renders different max', () => {
		const r = renderer(() => (
			<Rate name="test" max={7}>
				{{
					label: 'test'
				}}
			</Rate>
		));

		const maxAssertion = baseAssertion.setProperty(WrappedRadioGroup, 'options', [
			{ value: '1' },
			{ value: '2' },
			{ value: '3' },
			{ value: '4' },
			{ value: '5' },
			{ value: '6' },
			{ value: '7' }
		]);

		r.expect(maxAssertion);
	});

	it('renders with initial value', () => {
		const r = renderer(() => (
			<Rate name="test" max={2} initialValue={1}>
				{{
					label: 'test'
				}}
			</Rate>
		));

		const twoOptions = baseOptions.slice(0, 2);

		r.child(WrappedRadioGroup as any, {
			radios: ['test', createMockRadioGroupMiddleware('1'), twoOptions],
			label: []
		});
		const initialValueAssertion = baseAssertion
			.setProperty(WrappedRadioGroup, 'options', twoOptions)
			.setChildren(WrappedRadioGroup, () => ({
				label: 'test',
				radios: () => [
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, css.checked]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'1'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={true}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'1'}
							/>
						</label>
					</span>,
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'2'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'2'}
							/>
						</label>
					</span>
				]
			}));
		r.expect(initialValueAssertion);
	});

	it('renders half stars', () => {
		const r = renderer(() => (
			<Rate name="test" max={2} initialValue={1.5} allowHalf>
				{{
					label: 'test'
				}}
			</Rate>
		));

		const twoOptions = baseOptions.slice(0, 2);

		r.child(WrappedRadioGroup as any, {
			radios: ['test', createMockRadioGroupMiddleware('1.5'), twoOptions],
			label: []
		});
		const halfStarAssertion = baseAssertion
			.setProperty(WrappedRadioGroup, 'options', twoOptions)
			.setChildren(WrappedRadioGroup, () => ({
				label: 'test',
				radios: () => [
					<span classes={[fixedCss.halfWrapperFixed, false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, css.checked]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'0.5'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'0.5'}
							/>
						</label>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, css.checked]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'1'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'1'}
							/>
						</label>
					</span>,
					<span classes={[fixedCss.halfWrapperFixed, false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, css.checked]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'1.5'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={true}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'1.5'}
							/>
						</label>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'2'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'2'}
							/>
						</label>
					</span>
				]
			}));
		r.expect(halfStarAssertion);
	});

	it('renders visually checked on mouse over', () => {
		const r = renderer(() => (
			<Rate name="test" max={3} initialValue={1}>
				{{
					label: 'test'
				}}
			</Rate>
		));

		const threeOptions = baseOptions.slice(0, 3);

		r.child(WrappedRadioGroup as any, {
			radios: ['test', createMockRadioGroupMiddleware('1'), threeOptions],
			label: []
		});

		const WrappedThirdLabel = wrap('label');

		const initialAssertion = baseAssertion
			.setProperty(WrappedRadioGroup, 'options', threeOptions)
			.setChildren(WrappedRadioGroup, () => ({
				label: 'test',
				radios: () => [
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, css.checked]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'1'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={true}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'1'}
							/>
						</label>
					</span>,
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'2'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'2'}
							/>
						</label>
					</span>,
					<span classes={[false]}>
						<WrappedThirdLabel
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'3'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'3'}
							/>
						</WrappedThirdLabel>
					</span>
				]
			}));

		r.expect(initialAssertion);
		r.property(WrappedThirdLabel, 'onmouseenter');

		const visuallyCheckedAssertion = initialAssertion.setChildren(WrappedRadioGroup, () => ({
			label: 'test',
			radios: () => [
				<span classes={[false]}>
					<label
						classes={[null, fixedCss.labelFixed, css.icon, css.checked]}
						onmouseenter={noop}
						onmouseleave={noop}
						title={'1'}
					>
						<span classes={fixedCss.iconWrapperFixed}>
							<Icon
								size={'medium'}
								type={'starIcon'}
								theme={undefined}
								variant={undefined}
								classes={undefined}
							/>
						</span>
						<input
							checked={true}
							classes={baseCss.visuallyHidden}
							disabled={undefined}
							name={'test'}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							type={'radio'}
							value={'1'}
						/>
					</label>
				</span>,
				<span classes={[false]}>
					<label
						classes={[null, fixedCss.labelFixed, css.icon, css.checked]}
						onmouseenter={noop}
						onmouseleave={noop}
						title={'2'}
					>
						<span classes={fixedCss.iconWrapperFixed}>
							<Icon
								size={'medium'}
								type={'starIcon'}
								theme={undefined}
								variant={undefined}
								classes={undefined}
							/>
						</span>
						<input
							checked={false}
							classes={baseCss.visuallyHidden}
							disabled={undefined}
							name={'test'}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							type={'radio'}
							value={'2'}
						/>
					</label>
				</span>,
				<span classes={[false]}>
					<label
						classes={[null, fixedCss.labelFixed, css.icon, css.checked]}
						onmouseenter={noop}
						onmouseleave={noop}
						title={'3'}
					>
						<span classes={fixedCss.iconWrapperFixed}>
							<Icon
								size={'medium'}
								type={'starIcon'}
								theme={undefined}
								variant={undefined}
								classes={undefined}
							/>
						</span>
						<input
							checked={false}
							classes={baseCss.visuallyHidden}
							disabled={undefined}
							name={'test'}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							type={'radio'}
							value={'3'}
						/>
					</label>
				</span>
			]
		}));

		r.expect(visuallyCheckedAssertion);
	});

	it('renders read only', () => {
		const r = renderer(() => (
			<Rate name="test" max={2} initialValue={1} readOnly>
				{{
					label: 'test'
				}}
			</Rate>
		));

		const twoOptions = baseOptions.slice(0, 2);

		r.child(WrappedRadioGroup as any, {
			radios: ['test', createMockRadioGroupMiddleware('1'), twoOptions],
			label: []
		});
		const initialValueAssertion = baseAssertion
			.setProperty(WrappedRadioGroup, 'options', twoOptions)
			.setChildren(WrappedRadioGroup, () => ({
				label: 'test',
				radios: () => [
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, css.checked]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'1'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={true}
								classes={baseCss.visuallyHidden}
								disabled
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'1'}
							/>
						</label>
					</span>,
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'2'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'2'}
							/>
						</label>
					</span>
				]
			}));
		r.expect(initialValueAssertion);
	});

	it('updates selection when star clicked', () => {
		const onValueStub = sinon.stub();
		const threeOptions = baseOptions.slice(0, 3);

		const r = renderer(() => (
			<Rate name="test" max={3} onValue={onValueStub}>
				{{
					label: 'test'
				}}
			</Rate>
		));

		r.child(WrappedRadioGroup as any, {
			radios: ['test', createMockRadioGroupMiddleware('0'), threeOptions],
			label: []
		});
		const onValueAssertion = baseAssertion
			.setProperty(WrappedRadioGroup, 'options', threeOptions)
			.setChildren(WrappedRadioGroup, () => ({
				label: 'test',
				radios: () => [
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'1'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'1'}
							/>
						</label>
					</span>,
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'2'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'2'}
							/>
						</label>
					</span>,
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'3'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'3'}
							/>
						</label>
					</span>
				]
			}));

		r.expect(onValueAssertion);

		r.property(WrappedRadioGroup, 'onValue', '2');

		r.child(WrappedRadioGroup as any, {
			radios: ['test', createMockRadioGroupMiddleware('2'), threeOptions],
			label: []
		});

		const afterClickAssertion = onValueAssertion.setChildren(WrappedRadioGroup, () => ({
			label: 'test',
			radios: () => [
				<span classes={[false]}>
					<label
						classes={[null, fixedCss.labelFixed, css.icon, css.checked]}
						onmouseenter={noop}
						onmouseleave={noop}
						title={'1'}
					>
						<span classes={fixedCss.iconWrapperFixed}>
							<Icon
								size={'medium'}
								type={'starIcon'}
								theme={undefined}
								variant={undefined}
								classes={undefined}
							/>
						</span>
						<input
							checked={false}
							classes={baseCss.visuallyHidden}
							disabled={undefined}
							name={'test'}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							type={'radio'}
							value={'1'}
						/>
					</label>
				</span>,
				<span classes={[false]}>
					<label
						classes={[null, fixedCss.labelFixed, css.icon, css.checked]}
						onmouseenter={noop}
						onmouseleave={noop}
						title={'2'}
					>
						<span classes={fixedCss.iconWrapperFixed}>
							<Icon
								size={'medium'}
								type={'starIcon'}
								theme={undefined}
								variant={undefined}
								classes={undefined}
							/>
						</span>
						<input
							checked={true}
							classes={baseCss.visuallyHidden}
							disabled={undefined}
							name={'test'}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							type={'radio'}
							value={'2'}
						/>
					</label>
				</span>,
				<span classes={[false]}>
					<label
						classes={[null, fixedCss.labelFixed, css.icon, false]}
						onmouseenter={noop}
						onmouseleave={noop}
						title={'3'}
					>
						<span classes={fixedCss.iconWrapperFixed}>
							<Icon
								size={'medium'}
								type={'starIcon'}
								theme={undefined}
								variant={undefined}
								classes={undefined}
							/>
						</span>
						<input
							checked={false}
							classes={baseCss.visuallyHidden}
							disabled={undefined}
							name={'test'}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							type={'radio'}
							value={'3'}
						/>
					</label>
				</span>
			]
		}));

		r.expect(afterClickAssertion);
		assert.isTrue(onValueStub.calledWith(2));
	});

	it('shows focus', () => {
		const twoOptions = baseOptions.slice(0, 2);

		const r = renderer(() => (
			<Rate name="test" max={2}>
				{{
					label: 'test'
				}}
			</Rate>
		));

		const WrappedInput = wrap('input');

		r.child(WrappedRadioGroup as any, {
			radios: ['test', createMockRadioGroupMiddleware('0'), twoOptions],
			label: []
		});
		const beforeFocusAssertion = baseAssertion
			.setProperty(WrappedRadioGroup, 'options', twoOptions)
			.setChildren(WrappedRadioGroup, () => ({
				label: 'test',
				radios: () => [
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'1'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'1'}
							/>
						</label>
					</span>,
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'2'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<WrappedInput
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'2'}
							/>
						</label>
					</span>
				]
			}));

		r.expect(beforeFocusAssertion);

		r.property(WrappedInput, 'onfocus');

		const afterFocusAssertion = beforeFocusAssertion
			.setProperty(WrappedRootNode, 'classes', [css.root, undefined, css.focused])
			.setChildren(WrappedRadioGroup, () => ({
				label: 'test',
				radios: () => [
					<span classes={[false]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'1'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<input
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'1'}
							/>
						</label>
					</span>,
					<span classes={[css.focusedStar]}>
						<label
							classes={[null, fixedCss.labelFixed, css.icon, false]}
							onmouseenter={noop}
							onmouseleave={noop}
							title={'2'}
						>
							<span classes={fixedCss.iconWrapperFixed}>
								<Icon
									size={'medium'}
									type={'starIcon'}
									theme={undefined}
									variant={undefined}
									classes={undefined}
								/>
							</span>
							<WrappedInput
								checked={false}
								classes={baseCss.visuallyHidden}
								disabled={undefined}
								name={'test'}
								onblur={noop}
								onchange={noop}
								onfocus={noop}
								type={'radio'}
								value={'2'}
							/>
						</label>
					</span>
				]
			}));

		r.expect(afterFocusAssertion);
		r.property(WrappedInput, 'onblur');

		const afterBlurAssertion = beforeFocusAssertion.setChildren(WrappedRadioGroup, () => ({
			label: 'test',
			radios: () => [
				<span classes={[false]}>
					<label
						classes={[null, fixedCss.labelFixed, css.icon, false]}
						onmouseenter={noop}
						onmouseleave={noop}
						title={'1'}
					>
						<span classes={fixedCss.iconWrapperFixed}>
							<Icon
								size={'medium'}
								type={'starIcon'}
								theme={undefined}
								variant={undefined}
								classes={undefined}
							/>
						</span>
						<input
							checked={false}
							classes={baseCss.visuallyHidden}
							disabled={undefined}
							name={'test'}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							type={'radio'}
							value={'1'}
						/>
					</label>
				</span>,
				<span classes={[css.focusedStar]}>
					<label
						classes={[null, fixedCss.labelFixed, css.icon, false]}
						onmouseenter={noop}
						onmouseleave={noop}
						title={'2'}
					>
						<span classes={fixedCss.iconWrapperFixed}>
							<Icon
								size={'medium'}
								type={'starIcon'}
								theme={undefined}
								variant={undefined}
								classes={undefined}
							/>
						</span>
						<WrappedInput
							checked={false}
							classes={baseCss.visuallyHidden}
							disabled={undefined}
							name={'test'}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							type={'radio'}
							value={'2'}
						/>
					</label>
				</span>
			]
		}));

		r.expect(afterBlurAssertion);
	});
});
