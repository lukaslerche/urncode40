import { encode, decode } from './urncode40';

function testPadOptions() {
	console.log('Testing PAD Handling Options');
	console.log('===========================');

	const testCases = [
		{ input: 'A', desc: 'Single character (produces PAD)' },
		{ input: 'AB', desc: 'Two characters (produces PAD)' },
		{ input: 'aä', desc: 'Mixed standard and special chars' },
		{ input: 'A B', desc: 'Contains intentional space' },
		{ input: '123', desc: 'Short numeric string' }
	];

	for (const test of testCases) {
		console.log(`\n${test.desc}: "${test.input}"`);

		const encoded = encode(test.input);
		if (!encoded) {
			console.log('Failed to encode');
			continue;
		}

		console.log(`Encoded: ${encoded}`);

		// Default behavior now removes padding
		const defaultDecoded = decode(encoded);
		console.log(`Default (remove PAD): "${defaultDecoded}"`);

		// Option enabled preserves padding as whitespace
		const withPadDecoded = decode(encoded, { decodePadAsWhitespace: true });
		console.log(`With PAD as whitespace: "${withPadDecoded}"`);

		// Compare character lengths
		console.log(`Original length: ${test.input.length}`);
		console.log(`Default decoded length: ${defaultDecoded?.length}`);
		console.log(`PAD preserved length: ${withPadDecoded?.length}`);

		// Character codes for clarity
		if (defaultDecoded && withPadDecoded) {
			if (defaultDecoded !== withPadDecoded) {
				console.log('\nCharacter differences:');
				for (let i = 0; i < Math.max(defaultDecoded.length, withPadDecoded.length); i++) {
					const defChar = i < defaultDecoded.length ? defaultDecoded[i] : '';
					const padChar = i < withPadDecoded.length ? withPadDecoded[i] : '';

					if (defChar !== padChar) {
						console.log(`Position ${i}: Default="${defChar}" vs PAD="${padChar}"`);
					}
				}
			} else {
				console.log('Both decoded results are identical.');
			}
		}
	}
}

// Run the test
testPadOptions();
