import { encode, decode } from './urncode40';

export function testOptimalEncoding() {
  console.log('Testing Optimal Encoding Path Selection');
  console.log('=====================================');
  
  const testCases = [
    'A123456789A',           // Mix of letter + 9 digits + letter
    'A1234567890123456789A', // Mix with longer digit sequence
    '123456789A123456789',   // Digits + letter + digits
    'ABC123456789DEF',       // Letters + digits + letters
    'ABCDEFGHIJKLM123456789NOPQRSTUVWXYZ', // Many letters + digits + many letters
    '123DEF456GHI789',       // Alternating short runs of digits and letters
    'A0000000001B',          // Leading zeros case
    'A&B',                   // Mixed with special char
    '123456789&ABCDEF',      // Digits + special + letters
  ];
  
  for (const test of testCases) {
    console.log(`\nInput: "${test}"`);
    
    // Get encoded result
    const encoded = encode(test);
    
    if (!encoded) {
      console.log('Failed to encode');
      continue;
    }
    
    // Decode to verify correctness
    const decoded = decode(encoded);
    
    if (!decoded) {
      console.log('Failed to decode');
      continue;
    }
    
    console.log(`Encoded: ${encoded} (${encoded.length} chars)`);
    console.log(`Decoded: "${decoded}"`);
    
    // Check if FB encoding was used
    const usesFB = encoded.includes('FB');
    console.log(`Uses FB encoding: ${usesFB}`);
    
    // Check for special character encoding
    const usesSpecial = encoded.includes('FC') || encoded.includes('FD') || encoded.includes('FE');
    console.log(`Uses special encoding: ${usesSpecial}`);
    
    // Calculate standard encoding length for comparison
    let standardOnly = '';
    let canUseStandardOnly = true;
    
    for (let i = 0; i < test.length; i++) {
      if (!/[A-Z0-9 \-\.:]/.test(test[i].toUpperCase())) {
        canUseStandardOnly = false;
        break;
      }
    }
    
    if (canUseStandardOnly) {
      standardOnly = encodeLikeStandard(test);
      console.log(`Standard-only encoding: ${standardOnly} (${standardOnly.length} chars)`);
      console.log(`Optimal encoding is ${encoded.length < standardOnly.length ? 'shorter' : 'not shorter'} than standard-only`);
    } else {
      console.log('(Cannot use standard-only encoding due to special characters)');
    }
    
    // Verification
    if (decoded === test) {
      console.log('✓ PASS: Round-trip encoding/decoding succeeds');
    } else {
      console.log('✗ FAIL: Round-trip encoding/decoding fails');
      console.log(`  Expected: "${test}"`);
      console.log(`  Got:      "${decoded}"`);
    }
  }
}

// Simple function to encode like standard URN Code 40 (for testing)
function encodeLikeStandard(input: string): string {
  const charValues: Record<string, number> = {
    ' ': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9, 'J': 10,
    'K': 11, 'L': 12, 'M': 13, 'N': 14, 'O': 15, 'P': 16, 'Q': 17, 'R': 18, 'S': 19, 'T': 20,
    'U': 21, 'V': 22, 'W': 23, 'X': 24, 'Y': 25, 'Z': 26, '-': 27, '.': 28, ':': 29,
    '0': 30, '1': 31, '2': 32, '3': 33, '4': 34, '5': 35, '6': 36, '7': 37, '8': 38, '9': 39
  };
  
  let result = '';
  
  for (let i = 0; i < input.length; i += 3) {
    const triplet = input.substring(i, Math.min(i + 3, input.length)).padEnd(3, ' ');
    const c1 = triplet[0].toUpperCase();
    const c2 = triplet[1].toUpperCase();
    const c3 = triplet[2].toUpperCase();
    
    const value = 1600 * charValues[c1] + 40 * charValues[c2] + charValues[c3] + 1;
    result += value.toString(16).toUpperCase().padStart(4, '0');
  }
  
  return result;
}

// Run the test
testOptimalEncoding();
