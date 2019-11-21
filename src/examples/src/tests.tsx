const tests = (require as any).context('../../', true, /\.spec\.ts(x)?$/);
const url = new URL(window.location.href);
const params = url.searchParams;
const widget = params.get('widget');
tests.keys().forEach((id: string) => {
	if (widget && id.indexOf(widget) !== -1) {
		tests(id);
	}
});
