const gender = ['male', 'female'];
const firstNames = ['Paul', 'Anthony', 'Matthew'];
const lastNames = ['Bouchon', 'Gubler', 'Gadd'];

export function createData(rows: number = 10000) {
	let data = [];
	for (let i = 0; i < rows; i++) {
		data.push({
			id: i,
			firstName: firstNames[i % 3],
			lastName: lastNames[i % 3],
			gender: gender[i % 2]
		});
	}
	return data;
}
