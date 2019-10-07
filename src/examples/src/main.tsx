import renderer, { tsx } from '@dojo/framework/core/vdom';
import Registry from '@dojo/framework/core/Registry';
import { registerThemeInjector } from '@dojo/framework/core/mixins/Themed';
import dojo from '@dojo/themes/dojo';

import App from './App';

// const blah = require('./text-input/*');

const blah = (require as any).context("./text-input/", true);

console.log(blah);

const foo = blah('./Basic');
console.log(foo);

const registry = new Registry();
registerThemeInjector(dojo, registry);

const r = renderer(() => <App configs={[]}/>);
r.mount({ registry });
