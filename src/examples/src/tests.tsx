import has from '@dojo/framework/core/has';

if (!has('tests')) {
	if (typeof (require as any).context === 'undefined') {
		(require as any).context = () => {
			return { keys: () => [] };
		};
	}
}
const tests = (require as any).context('../../', true, /\.spec\.ts(x)?$/);
export default tests;
