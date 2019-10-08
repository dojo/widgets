import has from '@dojo/framework/core/has';
import renderer, { tsx } from '@dojo/framework/core/vdom';
import Registry from '@dojo/framework/core/Registry';
import { registerThemeInjector } from '@dojo/framework/core/mixins/Themed';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import dojo from '@dojo/themes/dojo';
import '@dojo/themes/dojo/index.css';

import routes from './routes';
import App from './App';

console.log('docs', has('docs'));

const registry = new Registry();
registerThemeInjector(dojo, registry);
registerRouterInjector(routes, registry);

const r = renderer(() => <App />);
r.mount({ registry, domNode: document.getElementById('app')! });
