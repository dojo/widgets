const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { v, w } from '@dojo/framework/widget-core/d';
import assertationTemplate from '@dojo/framework/testing/assertionTemplate';
import * as css from '../../../theme/helper-text.m.css';
import HelperText from '../../../helper-text/HelperText';
import harness from '@dojo/framework/testing/harness';

const baseTemplate = assertationTemplate(() => {
	return v('div', {
		key: 'root',
		classes: [
			css.root,
			null,
			null
		]
	});
});

const textTemplate = baseTemplate.setChildren('@root', [
	v('p', {
		key: 'text',
		classes: css.text,
		'aria-hidden': 'true',
		title: 'test'
	}, ['test'])
]);

registerSuite('HelperText', {
	tests: {
		'without text'() {
			const h = harness(() => w(HelperText, {}));
			h.expect(baseTemplate);
		},
		'with text'() {
			const h = harness(() => w(HelperText, { text: 'test' }));
			h.expect(textTemplate);
		},
		'valid'() {
			const validTemplate = textTemplate.setProperty('@root', 'classes', [
				css.root, css.valid, null
			]);
			const h = harness(() => w(HelperText, { text: 'test', valid: true }));
			h.expect(validTemplate);
		},
		'invalid'() {
			const invalidTemplate = textTemplate.setProperty('@root', 'classes', [
				css.root, null, css.invalid
			]);
			const h = harness(() => w(HelperText, { text: 'test', valid: false }));
			h.expect(invalidTemplate);
		}

	}
});
