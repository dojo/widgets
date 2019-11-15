const messages = {
	minimumLength: `{length, plural, offset:1
		=1 {Mininum 1 character.}
		other {Minimum {length} characters.}}`,
	maximumLength: `{length, plural, offset:1
		=1 {Maximum 1 character.}
		other {Maximum {length} characters.}}`,
	uppercase: `{count, plural, offset:1
		=1 {1 uppercase letter}
		other {{count} uppercase letters}}`,
	numbers: `{count, plural, offset:1
		=1 {1 number}
		other {{count} numbers}}`,
	specialCharacters: `{count, plural, offset:1
		=1 {1 special character}
		other {{count} special characters}}`,
	mustContain: 'Must contain {rules}',
	atLeastOf: 'at least {count} of: {rules}.',
	allOf: 'each of: {rules}.',
	and: 'and {rule}',
	or: 'or {rule}'
};

export default { messages };
