import { create, tsx } from '@dojo/framework/core/vdom';
import block from '@dojo/framework/core/middleware/block';
import Outlet from '@dojo/framework/routing/Outlet';

import myBlock from './my-block.block';

import * as css from './App.m.css';
import Menu from './Menu';

import configs from './config';

console.log(configs);

const factory = create({ block });

export default factory(function App({ middleware: { block }}) {
    const foo = block(myBlock)();
    console.log(foo);
    return (
        <div classes={[css.root]}>
        <div>
            <Menu/>
        </div>
            <div>
                <Outlet id="example" renderer={({ params }) => {
                    const { widget, example } = params;
                    const config = configs[widget].find((config: any) => config.title === example);
                    return (
                        <virtual>
                            	<h1>{config.title}</h1>
								{config.description ? <h4>{config.description}</h4> : null}
								<config.module />
                        </virtual>
                    );
                }}/>

            <div>


							</div>    
            </div>>
        </div>
    );
});