const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import { Remote } from 'intern/lib/executors/Node';
import { services } from '@theintern/a11y';
import * as css from '../../../theme/toolbar.m.css';
import * as slidePaneCss from '../../../theme/slide-pane.m.css';
import { uuid } from '@dojo/framework/core/util';

const axe = services.axe;

function getPage(remote: Remote) {
	return remote
		.get(`http://localhost:9000/dist/dev/src/common/example/?id=${uuid()}#toolbar`)
		.setFindTimeout(5000);
}

const DELAY = 1000;
const HEIGHT = 500;
const WIDTH = 500;

registerSuite('Toolbar', {
	'Should show menu when button is clicked'() {
		if (this.remote.session.capabilities.browserName === 'safari') {
			this.skip('SafariDriver does not support setting a specific window size.');
		}

		return getPage(this.remote)
			.setWindowSize(WIDTH, HEIGHT)
			.sleep(DELAY)
			.findByCssSelector(`body .${css.menuButton}`)
			.click()
			.end()
			.sleep(DELAY)
			.findByCssSelector(`body .${slidePaneCss.root}`)
			.isDisplayed()
			.then((displayed) => {
				assert.isTrue(displayed);
			});
	},

	'Should close menu when button is clicked'() {
		if (this.remote.session.capabilities.browserName === 'safari') {
			this.skip('SafariDriver does not support setting a specific window size.');
		}

		return getPage(this.remote)
			.setWindowSize(WIDTH, HEIGHT)
			.findByCssSelector(`body .${css.menuButton}`)
			.click()
			.end()
			.sleep(DELAY)
			.findByCssSelector(`body .${slidePaneCss.close}`)
			.click()
			.end()
			.sleep(DELAY)
			.findByCssSelector(`body .${slidePaneCss.title}`)
			.getPosition()
			.then((position) => {
				assert.isAbove(position.x, WIDTH - 50);
			});
	},

	'check accessibility'() {
		return getPage(this.remote).then(axe.createChecker());
	}
});
