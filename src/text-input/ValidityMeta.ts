import Base from '@dojo/framework/widget-core/meta/Base';

export class Validity extends Base {
	get(key: string | number) {
		const node = this.getNode(key) as HTMLInputElement | undefined;

		if (!node) {
			return { valid: true, message: '', value: undefined };
		}

		return {
			value: node.value,
			valid: node.validity.valid,
			message: node.validationMessage
		};
	}
}

export default Validity;
