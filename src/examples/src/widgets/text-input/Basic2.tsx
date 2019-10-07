import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';

const factory = create();

const Example = factory(function() {
    return <div><TextInput /></div>
});

export default Example;