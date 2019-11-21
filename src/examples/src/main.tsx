import global from '@dojo/framework/shim/global';
import has from '@dojo/framework/core/has';
import renderer, { tsx } from '@dojo/framework/core/vdom';
import Registry from '@dojo/framework/core/Registry';
import { registerThemeInjector } from '@dojo/framework/core/mixins/Themed';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import dojo from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';

`!has('docs')`;
import './tests';

import routes from './routes';
import App from './App';

if (!global.intern) {
	const includeDocs = Boolean(
		has('docs') === 'false' ? false : has('docs') === 'true' ? true : has('docs')
	);
	const registry = new Registry();
	registerThemeInjector(dojo, registry);
	registerRouterInjector(routes, registry);

	const r = renderer(() => <App includeDocs={includeDocs} />);
	r.mount({ registry, domNode: document.getElementById('app')! });
}
