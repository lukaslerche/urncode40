import { encode, decode } from './urncode40';

function testWhitespaceTrimming() {
  console.log('Testing Whitespace Trimming Options');
  console.log('==================================');
  
  const testCases = [
    'ABC',           // No internal spaces
    'A B C',         // With internal spaces
    'A  B  C',       // With multiple internal spaces
    'A BC',          // Mixed spacing
    'AB C',          // More mixed spacing
    'AB CD EF',      // Multiple words with spaces
    'A',             // Single character (will be padded)
    'AB',            // Two characters (will be padded)
    'A B',           // Two characters with space
  ];
  
  for (const test of testCases) {
    console.log(`\nOriginal: "${test}"`);
    
    // Encode the test string
    const encoded = encode(test);
    
    if (!encoded) {
      console.log('Failed to encode');
      continue;
    }
    console.log(`Encoded: ${encoded}`);
    
    // Decode with normal behavior (keep whitespace)
    const decodedNormal = decode(encoded);
    console.log(`Decoded (keep whitespace): "${decodedNormal}"`);
    
    // Decode with whitespace trimming
    const decodedTrimmed = decode(encoded, { trimInternalWhitespace: true });
    console.log(`Decoded (trim whitespace): "${decodedTrimmed}"`);
    
    // Compare lengths
    console.log(`Original length: ${test.length}`);
    console.log(`Normal decoded length: ${decodedNormal?.length}`);
    console.log(`Trimmed decoded length: ${decodedTrimmed?.length}`);
  }
  
  // Test case showing the impact on padding characters
  console.log('\n\nPadding Example:');
  const singleChar = 'X';
  const encoded = encode(singleChar);
  console.log(`Encoded 'X': ${encoded}`);
  console.log(`Decoded (normal): "${decode(encoded)}"`);
  console.log(`Decoded (trimmed): "${decode(encoded, { trimInternalWhitespace: true })}"`);
}

// Run the tests
testWhitespaceTrimming();
