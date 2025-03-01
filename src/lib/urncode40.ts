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

	// Pad the input to a multiple of 3 if needed
	const paddedInput = input.padEnd(Math.ceil(input.length / 3) * 3, ' ');
	
	let encoded = '';

	for (let i = 0; i < paddedInput.length; i += 3) {
		// Get the three characters to encode
		const char1 = paddedInput[i];
		const char2 = paddedInput[i + 1];
		const char3 = paddedInput[i + 2];

		// Check if all characters are valid - use uppercase for case-insensitivity
		const c1 = char1.toUpperCase();
		const c2 = char2.toUpperCase();
		const c3 = char3.toUpperCase();

		if (uc40[c1] === undefined || uc40[c2] === undefined || uc40[c3] === undefined) {
			return undefined;
		}

		// Calculate value using the formula: (1600*C1) + (40*C2) + C3 + 1
		const value = (1600 * uc40[c1]) + (40 * uc40[c2]) + uc40[c3] + 1;
		
		// Convert to hexadecimal and pad to 4 digits
		encoded += value.toString(16).toUpperCase().padStart(4, '0');
	}

	return encoded;
}

function decode(input: string): string | undefined {
	if (!input || input.length % 4 !== 0) return undefined;

	let res = '';

	for (let i = 0; i < input.length; i += 4) {
		// Parse the hexadecimal value - make case-insensitive
		let value = parseInt(input.substring(i, i + 4), 16);
		if (isNaN(value)) return undefined;

		value = value - 1; // Subtract the +1 from the encoding formula
		
		const char1 = Math.floor(value / 1600);
		value = value % 1600;
		
		const char2 = Math.floor(value / 40);
		const char3 = value % 40;

		if (uc40r[char1] === undefined || uc40r[char2] === undefined || uc40r[char3] === undefined) {
			return undefined;
		}

		// Only add non-pad characters to result unless they're at the end
		const triplet = uc40r[char1] + uc40r[char2] + uc40r[char3];
		res += triplet;
	}

	// Trim trailing spaces that might have been added as padding
	return res.trimEnd();
}

/**
 * Validates if a string can be encoded using URN Code 40
 * @param input The string to validate
 * @returns true if the string can be encoded, false otherwise
 */
function validate(input: string): boolean {
	if (!input) return false;
	
	// Check if all characters are valid URN Code 40 characters
	for (let i = 0; i < input.length; i++) {
		if (uc40[input[i].toUpperCase()] === undefined) {
			return false;
		}
	}
	
	return true;
}

export { encode, decode, validate };
