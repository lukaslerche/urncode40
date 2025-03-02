import { encode, decode } from './urncode40';

function testWhitespaceTrimmingFix() {
	console.log('Testing Fixed Whitespace Trimming');
	console.log('=================================');

	// Test cases that mix standard and special characters
	const testCases = [
		'aä', // Standard char + UTF-8 double byte
		'a£', // Standard char + UTF-8 double byte
		'a€', // Standard char + UTF-8 triple byte
		'AB€', // Two standard chars + UTF-8 triple byte
		'A&B', // Standard + special ASCII + standard
		'Luke Lerche', // Name with space (standard chars only)
		'äöü', // Multiple UTF-8 chars
		'a b c', // Intentional spaces
		'Hello, World!' // Punctuation
	];

	for (const test of testCases) {
		console.log(`\nInput: "${test}"`);

		// Encode the input
		const encoded = encode(test);
		if (!encoded) {
			console.log('Failed to encode');
			continue;
		}
		console.log(`Encoded: ${encoded}`);

		// Decode with both options
		const normalDecoded = decode(encoded);
		const trimmedDecoded = decode(encoded, { decodePadAsWhitespace: true });

		console.log(`Normal decoded: "${normalDecoded}"`);
		console.log(`With trimming: "${trimmedDecoded}"`);

		// Verify correctness
		console.log(`Normal correct: ${normalDecoded === test}`);
		console.log(
			`Trimmed correct: ${trimmedDecoded?.replace(/\s+/g, '') === test.replace(/\s+/g, '')}`
		);

		// Show character codes to debug spacing issues
		console.log('Character codes (normal):');
		for (let i = 0; normalDecoded && i < normalDecoded.length; i++) {
			console.log(`  ${i}: '${normalDecoded[i]}' (${normalDecoded.charCodeAt(i)})`);
		}

		console.log('Character codes (trimmed):');
		for (let i = 0; trimmedDecoded && i < trimmedDecoded.length; i++) {
			console.log(`  ${i}: '${trimmedDecoded[i]}' (${trimmedDecoded.charCodeAt(i)})`);
		}
	}
}

// Run the test
testWhitespaceTrimmingFix();
