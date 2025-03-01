import { encode, decode } from './urncode40';

function testExtendedEncoding() {
  console.log('Testing URN Code 40 Extended Encoding');
  console.log('');
  
    // Test standard URN Code 40 encoding (00)
    const standard = '16576.HS3701C-AFR.V0801990';
    const encodedStandard = encode(standard)!;
    console.log(`Standard URN Code 40: ${standard}`);
    console.log(`Encoded: ${encodedStandard}`);
    console.log(`Decoded: ${decode(encodedStandard)}`);
    console.log(`Success: ${decode(encodedStandard) === standard}`);
    console.log('');

  // Test long numeric string (FB)
  const longNumeric = '1234567890123456';
  const encodedLongNumeric = encode(longNumeric)!;
  console.log(`Long numeric: ${longNumeric}`);
  console.log(`Encoded: ${encodedLongNumeric}`);
  console.log(`Decoded: ${decode(encodedLongNumeric)}`);
  console.log(`Success: ${decode(encodedLongNumeric) === longNumeric}`);
  console.log('');
  
  // Test ISO/IEC 646 character not in base table (FC)
  const isoChar = '~';  // ASCII 126, not in base table
  const encodedIsoChar = encode(isoChar)!;
  console.log(`ISO/IEC 646 char: ${isoChar}`);
  console.log(`Encoded: ${encodedIsoChar}`);
  console.log(`Decoded: ${decode(encodedIsoChar)}`);
  console.log(`Success: ${decode(encodedIsoChar) === isoChar}`);
  console.log('');
  
  // Test double-byte UTF-8 character (FD)
  const doubleByteChar = 'é';  // Unicode U+00E9
  const encodedDoubleByteChar = encode(doubleByteChar)!;
  console.log(`Double-byte UTF-8 char: ${doubleByteChar}`);
  console.log(`Encoded: ${encodedDoubleByteChar}`);
  console.log(`Decoded: ${decode(encodedDoubleByteChar)}`);
  console.log(`Success: ${decode(encodedDoubleByteChar) === doubleByteChar}`);
  console.log('');
  
  // Test triple-byte UTF-8 character (FE)
  const tripleByteChar = '€';  // Unicode U+20AC
  const encodedTripleByteChar = encode(tripleByteChar)!;
  console.log(`Triple-byte UTF-8 char: ${tripleByteChar}`);
  console.log(`Encoded: ${encodedTripleByteChar}`);
  console.log(`Decoded: ${decode(encodedTripleByteChar)}`);
  console.log(`Success: ${decode(encodedTripleByteChar) === tripleByteChar}`);
  console.log('');
  
  // Test mixed content
  const mixed = 'ABC-123:456789012345678XYZ€é~';
  const encodedMixed = encode(mixed)!;
  console.log(`Mixed content: ${mixed}`);
  console.log(`Encoded: ${encodedMixed}`);
  console.log(`Decoded: ${decode(encodedMixed)}`);
  console.log(`Success: ${decode(encodedMixed) === mixed}`);
}

// Run the tests
testExtendedEncoding();
