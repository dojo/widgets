const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { v, w } from '@dojo/framework/widget-core/d';
import Focus from '@dojo/framework/widget-core/meta/Focus';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import Label from '../../../label/index';
import TextInput from '../../index';
import * as css from '../../../theme/text-input.m.css';
import * as fixedCss from '../../styles/text-input.m.css';
import { compareForId, compareId, createHarness, MockMetaMixin, noop, stubEvent } from '../../../common/tests/support/test-helpers';

const harness = createHarness([ compareId, compareForId ]);

interface States {
	disabled?: boolean;
	required?: boolean;
	invalid?: boolean;
	readOnly?: boolean;
}

const baseAssertion = assertionTemplate(() => {
	return v('div', {
		key: 'root',
		classes: []
	}, [
		v('div', { key: 'wrapper', classes: css.inputWrapper }, [
			v('input', {
				'aria-invalid': null,
				'aria-readonly': null,
				autocomplete: undefined,
				classes: css.input,
				disabled: false,
				focus: noop,
				id: '',
				key: 'input',
				maxlength: null,
				minlength: null,
				name: undefined,
				onblur: noop,
				onclick: noop,
				onfocus: noop,
				oninput: noop,
				onkeydown: noop,
				onpointerover: noop,
				onpointerout: noop,
				pattern: undefined,
				placeholder: undefined,
				readOnly: false,
				required: false,
				type: 'text',
				value: undefined
			})
		])
	]);
});

const rootChildren = baseAssertion.getChildren('@root');

const withLabelAssertion = baseAssertion
.setChildren('@root', [
	w(Label, {
		key: 'label',
		classes: {
			'@dojo/widgets/label': {
				root: [css.label, null]
			}
		},
		disabled: false,
		focused: false,
		forId: 'id',
		hidden: false,
		invalid: undefined,
		readOnly: false,
		required: false,
		theme: undefined
	}, [ 'test label' ]),
	...rootChildren
]);

function createClassesComparator(key: string, expectedClasses: string[]) {
	return {
		selector: key,
		property: 'classes',
		comparator: (actualClasses: string | string[]) => {
			if (!Array.isArray(actualClasses)) {
				actualClasses = [ actualClasses ];
			}
			const filteredClasses = actualClasses.filter(className => className);
			return filteredClasses.length === expectedClasses.length &&
				filteredClasses.every((className: string, index: number) => className === expectedClasses[index]);
		}
	};
}

const defaultRootClassComparator = createClassesComparator('@root', [
	css.root,
	fixedCss.rootFixed,
	fixedCss.labelBeforeFixed
]);

registerSuite('TextInput', {
	tests: {
		'default properties'() {
			const h = harness(() => w(TextInput, {}), [ defaultRootClassComparator ]);
			h.expect(baseAssertion);
		},

		'custom properties'() {
			const rootClassComparator = createClassesComparator('@root', [
				css.root,
				css.hasValue,
				fixedCss.rootFixed,
				fixedCss.labelBeforeFixed
			]);

			const h = harness(() => w(TextInput, {
				maxLength: 50,
				minLength: 10,
				name: 'bar',
				placeholder: 'baz',
				type: 'email',
				value: 'hello world'
			}), [ rootClassComparator ]);

			const assertion = baseAssertion
				.setProperty('@input', 'maxlength', '50')
				.setProperty('@input', 'minlength', '10')
				.setProperty('@input', 'name', 'bar')
				.setProperty('@input', 'placeholder', 'baz')
				.setProperty('@input', 'type', 'email')
				.setProperty('@input', 'value', 'hello world');

			h.expect(assertion);
		},

		'pattern': {
			'string'() {
				const h = harness(() => w(TextInput, {
					pattern: '^foo|bar$'
				}), [ defaultRootClassComparator ]);

				const assertion = baseAssertion
					.setProperty('@input', 'pattern', '^foo|bar$');

				h.expect(assertion);
			},
			'regexp'() {
				const h = harness(() => w(TextInput, {
					pattern: /^ham|spam$/
				}), [ defaultRootClassComparator ]);

				const assertion = baseAssertion
					.setProperty('@input', 'pattern', '^ham|spam$');

				h.expect(assertion);
			}
		},

		'autocomplete': {
			'true'() {
				const h = harness(() => w(TextInput, {
					autocomplete: true
				}), [ defaultRootClassComparator ]);

				const assertion = baseAssertion
					.setProperty('@input', 'autocomplete', 'on');

				h.expect(assertion);
			},
			'false'() {
				const h = harness(() => w(TextInput, {
					autocomplete: false
				}), [ defaultRootClassComparator ]);

				const assertion = baseAssertion
					.setProperty('@input', 'autocomplete', 'off');

				h.expect(assertion);
			},
			'string'() {
				const h = harness(() => w(TextInput, {
					autocomplete: 'name'
				}), [ defaultRootClassComparator ]);

				const assertion = baseAssertion
					.setProperty('@input', 'autocomplete', 'name');

				h.expect(assertion);
			}
		},

		'label': {
			'before label'() {
				const h = harness(() => w(TextInput, {
					label: 'test label',
					labelPosition: 'before'
				}), [ defaultRootClassComparator ]);

				h.expect(withLabelAssertion);
			},

			'after label'() {
				const rootClassComparator = createClassesComparator('@root', [
					css.root,
					fixedCss.rootFixed,
					fixedCss.labelAfterFixed
				]);

				const h = harness(() => w(TextInput, {
					label: 'test label',
					labelPosition: 'after'
				}), [ rootClassComparator ]);

				h.expect(withLabelAssertion);
			},

			'above label'() {
				const rootClassComparator = createClassesComparator('@root', [
					css.root,
					fixedCss.rootFixed,
					fixedCss.labelAboveFixed
				]);

				const h = harness(() => w(TextInput, {
					label: 'test label',
					labelPosition: 'above'
				}), [ rootClassComparator ]);

				h.expect(withLabelAssertion);
			},

			'below label'() {
				const rootClassComparator = createClassesComparator('@root', [
					css.root,
					fixedCss.rootFixed,
					fixedCss.labelBelowFixed
				]);

				const h = harness(() => w(TextInput, {
					label: 'test label',
					labelPosition: 'below'
				}), [ rootClassComparator ]);

				h.expect(withLabelAssertion);
			}
		},

		'events'() {
			const onBlur = sinon.stub();
			const onChange = sinon.stub();
			const onClick = sinon.stub();
			const onFocus = sinon.stub();
			const onValue = sinon.stub();
			const onKey = sinon.stub();

			const h = harness(() => w(TextInput, {
				onBlur,
				onClick,
				onFocus,
				onValue,
				onKey
			}));

			h.trigger('@input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('@input', 'onclick', stubEvent);
			assert.isTrue(onClick.called, 'onClick called');
			h.trigger('@input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');
			h.trigger('@input', 'oninput', stubEvent);
			assert.isTrue(onValue.called, 'onValue called');
			h.trigger('@input', 'onkeydown', stubEvent);
			assert.isTrue(onKey.called, 'onKey called');
		}
	}
});
