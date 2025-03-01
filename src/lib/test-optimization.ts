import { encode, decode } from './urncode40';

export function testOptimizations() {
	console.log('Testing URN Code 40 Encoding Optimizations');
	console.log('=========================================');

	// Test 1: Numbers with leading zeros
	const leadingZerosTests = [
		'0000000000001', // 13 zeros + 1 -> Should use FB encoding
		'000123456789', // Leading zeros with 9+ digits total
		'0000000000000000000001' // 20 zeros + 1
	];

	console.log('NUMBERS WITH LEADING ZEROS:');
	for (const test of leadingZerosTests) {
		const encoded = encode(test)!;
		const decoded = decode(encoded)!;

		console.log(`\nInput:   "${test}" (${test.length} chars)`);
		console.log(`Encoded: ${encoded} (${encoded.length} chars)`);
		console.log(`Decoded: "${decoded}"`);
		console.log(`Success: ${test === decoded}`);

		// Show if FB encoding was used
		console.log(`FB used: ${encoded.includes('FB')}`);

		// Compare with standard encoding length
		const standardLength = Math.ceil(test.length / 3) * 4;
		console.log(
			`Standard encoding would be ${standardLength} chars (${encoded.length < standardLength ? 'saved' : 'no savings'} ${Math.abs(standardLength - encoded.length)} chars)`
		);
	}

	// Test 2: Mixed alphanumeric strings where FB might not be efficient
	const mixedTests = [
		'123456789A', // 9 digits + 1 letter (FB might not be worth it)
		'123456789AB', // 9 digits + 2 letters
		'1234567890123A', // 13 digits + 1 letter
		'A123456789', // 1 letter + 9 digits
		'123456789ABCDEFG' // 9 digits + 7 letters
	];

	console.log('\nMIXED ALPHANUMERIC STRINGS:');
	for (const test of mixedTests) {
		const encoded = encode(test)!;
		const decoded = decode(encoded)!;

		console.log(`\nInput:   "${test}" (${test.length} chars)`);
		console.log(`Encoded: ${encoded} (${encoded.length} chars)`);
		console.log(`Decoded: "${decoded}"`);
		console.log(`Success: ${test === decoded}`);

		// Show if FB encoding was used
		console.log(`FB used: ${encoded.includes('FB')}`);

		// Calculate standard encoding length for comparison
		const standardLength = Math.ceil(test.length / 3) * 4;
		console.log(
			`Standard encoding would be ${standardLength} chars (${encoded.length < standardLength ? 'saved' : 'no savings'} ${Math.abs(standardLength - encoded.length)} chars)`
		);
	}
}

// Run the tests
testOptimizations();
