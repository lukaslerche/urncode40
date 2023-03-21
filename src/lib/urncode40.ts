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

function encode(input: string): string | undefined {
	if (!input) {
		console.log('Empty input');

		return undefined;
	}

	let encoded = '';
	let charCount = 0;
	let currentSum = 1;

	for (let i = 0; i < input.length; i++) {
		if (charCount == 3) {
			encoded += currentSum.toString(16).toUpperCase().padStart(4, '0');
			charCount = 0;
			currentSum = 1;
		}

		if (uc40[input[i]] === undefined) {
			return undefined;
		}

		currentSum += uc40[input[i]] * Math.pow(40, 2 - (i % 3));
		charCount++;
	}

	encoded += currentSum.toString(16).toUpperCase().padStart(4, '0');
	return encoded;
}

function decode(input: string): string {
	return 'NOT IMPLEMENTED YET';
}

export { encode, decode };
