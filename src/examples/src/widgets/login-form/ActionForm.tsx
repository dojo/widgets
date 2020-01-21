import { create, tsx } from '@dojo/framework/core/vdom';
import LoginForm from '@dojo/widgets/login-form';

const factory = create();

export default factory(function ActionForm() {
	return <LoginForm action="https://postman-echo.com/post" method="post" />;
});
