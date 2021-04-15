import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { listOptionTemplate } from '../../template';

const factory = create({ icache });

const exampleStyles = `
    .exampleList {
        --mdc-list-item-selected-background: #4fc3f7;
        --mdc-list-item-selected-color: #eeeeee;
        --mdc-list-item-active-background: #0093c4;
        --mdc-list-item-active-color: #ffffff;
        --mdc-list-item-hover-background: #4fc3f7;
        --mdc-list-item-hover-color: #eeeeee;

        --list-item-selected-background: #43a047;
        --list-item-selected-color: #eeeeee;
        --list-item-active-background: #00701a;
        --list-item-active-color: #ffffff;
        --list-item-hover-background: #43a047;
        --list-item-hover-color: #eeeeee;
    }
`;

export default factory(function CustomTheme({ middleware: { icache } }) {
	return (
		<Example>
			<style innerHTML={exampleStyles} />
			<div classes="exampleList">
				<List
					variant="inherit"
					resource={{ template: listOptionTemplate }}
					onValue={(value) => {
						icache.set('value', value);
					}}
				/>
			</div>
			<p>{`Clicked on: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
