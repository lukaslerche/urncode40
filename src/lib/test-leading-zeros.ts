import { encode, decode } from './urncode40';

export function testLeadingZeros() {
	console.log('Testing Leading Zero Encoding in URN Code 40');
	console.log('===========================================');

	const testCases = [
		'0000000000001', // 13 zeros + 1 = 14 digits (should be FB4000000001)
		'00000000001', // 10 zeros + 1 = 11 digits
		'000000000000000000000001', // 22 zeros + 1 = 23 digits
		'0123456789', // 1 zero + 9 digits = 10 digits
		'000000000', // 9 zeros = 9 digits
		'00000000000000000000000001' // 25 zeros + 1 = 26 digits (too long for FB)
	];

	for (const test of testCases) {
		console.log(`\nInput: "${test}" (${test.length} digits)`);

		if (test.length > 24) {
			console.log('Too long for FB encoding (>24 digits)');
			continue;
		}

		const encoded = encode(test);
		console.log(`Encoded: ${encoded}`);

		if (encoded) {
			const decoded = decode(encoded);
			console.log(`Decoded: "${decoded}"`);
			console.log(`FB used: ${encoded.startsWith('FB')}`);

			if (decoded === test) {
				console.log('✓ PASS: Decoded matches input');
			} else {
				console.log('✗ FAIL: Decoded does not match input');
				console.log(`  Expected: "${test}"`);
				console.log(`  Got:      "${decoded}"`);
			}

			// Calculate length comparison
			const fbLength = encoded.length;
			const standardLength = Math.ceil(test.length / 3) * 4;
			console.log(`Length: FB=${fbLength} vs Standard=${standardLength}`);
			console.log(
				`Space ${fbLength < standardLength ? 'saved' : 'used'}: ${Math.abs(standardLength - fbLength)} chars`
			);
		} else {
			console.log('Encoding failed');
		}
	}
}

// Run tests
testLeadingZeros();
