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

// Checks if a string consists only of digits
function isNumeric(str: string): boolean {
	return /^\d+$/.test(str);
}

// Calculate the encoded length of a string using standard URN Code 40 encoding
function calculateStandardEncodingLength(str: string): number {
	return Math.ceil(str.length / 3) * 4; // Each triplet takes 4 hex chars
}

// Encodes a long numeric string using the FB extension
function encodeLongNumeric(numStr: string): string {
	if (numStr.length < 9 || numStr.length > 24 || !isNumeric(numStr)) {
		return '';
	}

	// Convert the numeric string to a big integer (will lose leading zeros)
	const numValue = BigInt(numStr);

	// Convert to bytes (msb first)
	let hexValue = numValue.toString(16).toUpperCase();
	if (hexValue.length % 2 !== 0) hexValue = '0' + hexValue;

	// Ensure we have at least 4 bytes (8 hex chars) - for numbers with leading zeros
	while (hexValue.length < 8) {
		hexValue = '00' + hexValue;
	}

	// Calculate number of bytes needed
	const byteCount = Math.ceil(hexValue.length / 2);
	if (byteCount > 19) return ''; // Check if exceeds max bytes

	// Create the second byte value: digits (9-24 as 0-F) and byte count (4-19 as 0-F)
	const digitCode = (numStr.length - 9).toString(16).toUpperCase();
	const byteCode = (byteCount - 4).toString(16).toUpperCase();
	const secondByte = digitCode + byteCode;

	return 'FB' + secondByte + hexValue;
}

function encode(input: string): string | undefined {
	if (!input) return undefined;

	let encoded = '';
	let i = 0;
	// Buffer to store standard characters before encoding them as triplets
	let standardBuffer = '';

	// Helper function to encode standard character buffer as triplets
	function encodeStandardBuffer() {
		while (standardBuffer.length > 0) {
			// Take up to 3 characters from the buffer
			const triplet = standardBuffer.substring(0, 3);
			standardBuffer = standardBuffer.substring(3);

			// If this is the last chunk and it's less than 3 characters, pad it
			const paddedTriplet = triplet.length < 3 ? triplet.padEnd(3, ' ') : triplet;

			// Calculate value using the formula
			const value =
				1600 * uc40[paddedTriplet[0].toUpperCase()] +
				40 * uc40[paddedTriplet[1].toUpperCase()] +
				uc40[paddedTriplet[2].toUpperCase()] +
				1;

			encoded += value.toString(16).toUpperCase().padStart(4, '0');
		}
	}

	while (i < input.length) {
		// Check for long numeric string (9-24 digits)
		if (isNumeric(input[i])) {
			let j = i;
			while (j < input.length && isNumeric(input[j])) {
				j++;
			}
			const numericRun = input.substring(i, j);

			if (numericRun.length >= 9 && numericRun.length <= 24) {
				// Compare standard encoding versus FB encoding
				const fbEncoding = encodeLongNumeric(numericRun);
				const fbLength = fbEncoding.length;
				const standardLength = calculateStandardEncodingLength(numericRun);

				// Only use FB encoding if it's more efficient
				if (fbEncoding && fbLength <= standardLength) {
					// Encode any buffered standard characters first
					encodeStandardBuffer();

					encoded += fbEncoding;
					i = j;
					continue;
				}
			}

			// If we didn't use FB encoding, add all digits to the standard buffer
			while (i < j) {
				standardBuffer += input[i];
				i++;
			}
			continue;
		}

		// Check for character type
		const char = input[i];
		const charCode = char.charCodeAt(0);

		if (uc40[char.toUpperCase()] !== undefined) {
			// Standard character - add to buffer
			standardBuffer += char;
			i++;
		} else {
			// Non-standard character - encode any buffered standard characters first
			encodeStandardBuffer();

			// Now encode the special character
			if (charCode <= 127) {
				// ISO/IEC 646 character not in the base table
				encoded += 'FC' + charCode.toString(16).toUpperCase().padStart(2, '0');
			} else if (charCode <= 0x7ff) {
				// Double-byte UTF-8 character
				const byte1 = 0xc0 | (charCode >> 6);
				const byte2 = 0x80 | (charCode & 0x3f);
				encoded +=
					'FD' +
					byte1.toString(16).toUpperCase().padStart(2, '0') +
					byte2.toString(16).toUpperCase().padStart(2, '0');
			} else if (charCode <= 0xffff) {
				// Triple-byte UTF-8 character
				const byte1 = 0xe0 | (charCode >> 12);
				const byte2 = 0x80 | ((charCode >> 6) & 0x3f);
				const byte3 = 0x80 | (charCode & 0x3f);
				encoded +=
					'FE' +
					byte1.toString(16).toUpperCase().padStart(2, '0') +
					byte2.toString(16).toUpperCase().padStart(2, '0') +
					byte3.toString(16).toUpperCase().padStart(2, '0');
			} else {
				// Character cannot be encoded
				return undefined;
			}
			i++;
		}
	}

	// Encode any remaining standard characters in the buffer
	encodeStandardBuffer();

	return encoded;
}

function decode(input: string): string | undefined {
	if (!input || input.length < 2) return undefined;

	let res = '';
	let i = 0;

	while (i < input.length) {
		// Check for extended encoding markers
		if (i <= input.length - 2) {
			const marker = input.substring(i, i + 2).toUpperCase();

			// FB: Long numeric string
			if (marker === 'FB' && i + 4 <= input.length) {
				const secondByte = input.substring(i + 2, i + 4);
				const digitCount = parseInt(secondByte[0], 16) + 9; // 0-F -> 9-24 digits
				const byteCount = parseInt(secondByte[1], 16) + 4; // 0-F -> 4-19 bytes

				if (i + 4 + byteCount * 2 <= input.length) {
					const hexValue = input.substring(i + 4, i + 4 + byteCount * 2);
					try {
						// Convert hex to bigint then to string, pad with leading zeros if needed
						const numValue = BigInt('0x' + hexValue).toString();
						res += numValue.padStart(digitCount, '0');
						i += 4 + byteCount * 2;
						continue;
					} catch {
						return undefined; // Invalid hexadecimal
					}
				}
			}

			// FC: ISO/IEC 646 character
			if (marker === 'FC' && i + 4 <= input.length) {
				const charCode = parseInt(input.substring(i + 2, i + 4), 16);
				if (charCode <= 127) {
					res += String.fromCharCode(charCode);
					i += 4;
					continue;
				}
			}

			// FD: Double-byte UTF-8
			if (marker === 'FD' && i + 6 <= input.length) {
				const byte1 = parseInt(input.substring(i + 2, i + 4), 16);
				const byte2 = parseInt(input.substring(i + 4, i + 6), 16);

				// Verify bytes follow UTF-8 format
				if ((byte1 & 0xe0) === 0xc0 && (byte2 & 0xc0) === 0x80) {
					const charCode = ((byte1 & 0x1f) << 6) | (byte2 & 0x3f);
					res += String.fromCharCode(charCode);
					i += 6;
					continue;
				}
			}

			// FE: Triple-byte UTF-8
			if (marker === 'FE' && i + 8 <= input.length) {
				const byte1 = parseInt(input.substring(i + 2, i + 4), 16);
				const byte2 = parseInt(input.substring(i + 4, i + 6), 16);
				const byte3 = parseInt(input.substring(i + 6, i + 8), 16);

				// Verify bytes follow UTF-8 format
				if ((byte1 & 0xf0) === 0xe0 && (byte2 & 0xc0) === 0x80 && (byte3 & 0xc0) === 0x80) {
					const charCode = ((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f);
					res += String.fromCharCode(charCode);
					i += 8;
					continue;
				}
			}
		}

		// Standard URN Code 40 decoding (4-byte blocks)
		if (i + 4 <= input.length) {
			// Parse the hexadecimal value
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
			i += 4;
		} else {
			return undefined; // Invalid format
		}
	}

	// Trim trailing spaces that might have been added as padding
	return res.trimEnd();
}

/**
 * Validates if a string can be encoded using URN Code 40 (including extended encoding)
 * @param input The string to validate
 * @returns true if the string can be encoded, false otherwise
 */
function validate(input: string): boolean {
	if (!input) return false;

	// With extended encoding, any character that is either:
	// 1. In the base URN Code 40 table
	// 2. An ISO/IEC 646 character (ASCII 0-127)
	// 3. In the Unicode BMP (up to U+FFFF) for UTF-8 encoding
	// can be encoded
	for (let i = 0; i < input.length; i++) {
		const char = input[i];
		const charCode = char.charCodeAt(0);

		if (uc40[char.toUpperCase()] === undefined && charCode > 0xffff) {
			return false;
		}
	}

	return true;
}

export { encode, decode, validate };
