function reverseRecord<T extends PropertyKey, U extends PropertyKey>(input: Record<T, U>) {
	return Object.fromEntries(Object.entries(input).map(([key, value]) => [value, key])) as Record<
		U,
		T
	>;
}

const uc40: Record<string, number> = {
	' ': 0,
	A: 1,
	B: 2,
	C: 3,
	D: 4,
	E: 5,
	F: 6,
	G: 7,
	H: 8,
	I: 9,
	J: 10,
	K: 11,
	L: 12,
	M: 13,
	N: 14,
	O: 15,
	P: 16,
	Q: 17,
	R: 18,
	S: 19,
	T: 20,
	U: 21,
	V: 22,
	W: 23,
	X: 24,
	Y: 25,
	Z: 26,
	'-': 27,
	'.': 28,
	':': 29,
	'0': 30,
	'1': 31,
	'2': 32,
	'3': 33,
	'4': 34,
	'5': 35,
	'6': 36,
	'7': 37,
	'8': 38,
	'9': 39
};

const uc40r = reverseRecord(uc40);

function encode(input: string): string | undefined {
	if (!input) return undefined;

	let encoded = '';
	let charCount = 0;
	let currentSum = 1;

	for (let i = 0; i < input.length; i++) {
		if (charCount == 3) {
			encoded += currentSum.toString(16).toUpperCase().padStart(4, '0');
			charCount = 0;
			currentSum = 1;
		}

		if (uc40[input[i]] === undefined) return undefined;

		currentSum += uc40[input[i]] * Math.pow(40, 2 - (i % 3));
		charCount++;
	}

	encoded += currentSum.toString(16).toUpperCase().padStart(4, '0');
	return encoded;
}

function decode(input: string): string | undefined {
	if (!input || input.length % 4 != 0) return undefined;

	let res = '';

	for (let i = 0; i < input.length; i += 4) {
		let value = parseInt(input.substring(i + 0, i + 4), 16);
		if (!value) return undefined;

		let char1 = 0;
		let char2 = 0;
		let char3 = 0;

		if (value > 1600) {
			const rest = value % 1600;
			char1 = value - rest;
			value = rest;
			char1 = char1 / 1600;
		}
		if (value > 40) {
			const rest = value % 40;
			char2 = value - rest;
			value = rest;
			char2 = char2 / 40;
		}
		char3 = value - 1;

		res += uc40r[char1] + uc40r[char2] + uc40r[char3];
	}
	return res;
}

export { encode, decode };
