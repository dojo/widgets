import { Read } from './resource';

const fetcher: Read<any> = async (options = {}) => {
	const { pagination, query } = options;
	let url = `https://mixolydian-appendix.glitch.me/user?`;

	if (pagination) {
		const pageNumber = pagination.offset / pagination.size + 1;
		url = `${url}page=${pageNumber}&size=${pagination.size}`;
	}
	if (query) {
		url = `${url}&firstName=${query}`;
	}

	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();

	return {
		data: data.data.map((item: any) => ({ value: `${item.firstName} ${item.lastName}` })),
		total: data.total
	};
};

export default fetcher;
