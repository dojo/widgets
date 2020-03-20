const messages = {
	starLabels: `{denominator, plural, offset:0
		=1 {{quotient, plural, offset:0
			=1 {1 Star}
			other {{quotient} Stars}
		}}
		other {{numerator, plural, offset:0
			=0 {{quotient, plural, offset:0
				=1 {1 Star}
				other {{quotient} Stars}
			}}
			other {{quotient, plural, offset:0
				=0 {{numerator}/{denominator} Star}
				=1 {1 {numerator}/{denominator} Star}
				other {{quotient} {numerator}/{denominator} Stars}
			}}
		}}
	}`
};

export default { messages };
