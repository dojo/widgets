import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';

const factory = create();

const Example = factory(function() {
    return <TextInput />
});

export default {
    title: 'Text Input',
    type: 'text-input',
    description: 'The basic usage of text input',
    example: Example
};