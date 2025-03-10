# URN Code 40 Encoder/Decoder

A web-based tool for encoding and decoding text using the URN Code 40 specification, including extended encoding support.

## Features

- Encode and decode text using the URN Code 40 specification
- Support for extended encoding:
  - FB: Long numeric strings (9-24 digits)
  - FC: ISO/IEC 646 characters
  - FD: Double-byte UTF-8 characters
  - FE: Triple-byte UTF-8 characters
- Copy encoded or decoded text to clipboard
- Persistent storage of entered text using localStorage

## URN Code 40 Specification

URN Code 40 is an encoding scheme that provides a method to encode data in conformity with the urn:oid namespace scheme. The basic encoding process takes a string of three data characters and compacts these into two bytes (four hexadecimal characters).

### Basic Character Set

- Space, A-Z, hyphen (-), period (.), colon (:), digits 0-9

### Encoding Formula

The standard encoding uses the formula:

```
(1600*C1) + (40*C2) + C3 + 1
```

Where C1, C2, and C3 are the decimal values of three characters from the URN Code 40 character set.

### Extended Encoding

URN Code 40 also includes extended encoding capabilities:

- **FB**: Long numeric string encoding (for 9-24 digits)
- **FC**: ISO/IEC 646 characters not in the base table
- **FD**: Double-byte UTF-8 characters
- **FE**: Triple-byte UTF-8 characters

## URN Code 40 Character Set

| Graphic Symbol | Name             | HEX Code | 8-bit code | URN Code 40 (decimal) |
| -------------- | ---------------- | -------- | ---------- | --------------------- |
|                | PAD              |          |            | 0                     |
| A              | Capital letter A | 41       | 01000001   | 1                     |
| B              | Capital letter B | 42       | 01000010   | 2                     |
| C              | Capital letter C | 43       | 01000011   | 3                     |
| D              | Capital letter D | 44       | 01000100   | 4                     |
| E              | Capital letter E | 45       | 01000101   | 5                     |
| F              | Capital letter F | 46       | 01000110   | 6                     |
| G              | Capital letter G | 47       | 01000111   | 7                     |
| H              | Capital letter H | 48       | 01001000   | 8                     |
| I              | Capital letter I | 49       | 01001001   | 9                     |
| J              | Capital letter J | 4A       | 01001010   | 10                    |
| K              | Capital letter K | 4B       | 01001011   | 11                    |
| L              | Capital letter L | 4C       | 01001100   | 12                    |
| M              | Capital letter M | 4D       | 01001101   | 13                    |
| N              | Capital letter N | 4E       | 01001110   | 14                    |
| O              | Capital letter O | 4F       | 01001111   | 15                    |
| P              | Capital letter P | 50       | 01010000   | 16                    |
| Q              | Capital letter Q | 51       | 01010001   | 17                    |
| R              | Capital letter R | 52       | 01010010   | 18                    |
| S              | Capital letter S | 53       | 01010011   | 19                    |
| T              | Capital letter T | 54       | 01010100   | 20                    |
| U              | Capital letter U | 55       | 01010101   | 21                    |
| V              | Capital letter V | 56       | 01010110   | 22                    |
| W              | Capital letter W | 57       | 01010111   | 23                    |
| X              | Capital letter X | 58       | 01011000   | 24                    |
| Y              | Capital letter Y | 59       | 01011001   | 25                    |
| Z              | Capital letter Z | 5A       | 01011011   | 26                    |
| -              | Hypen-Minus      | 2D       | 00101101   | 27                    |
| .              | Full stop        | 2E       | 00101110   | 28                    |
| :              | Colon            | 3A       | 00101110   | 29                    |
| 0              | Digit zero       | 30       | 00110000   | 30                    |
| 1              | Digit one        | 31       | 00110001   | 31                    |
| 2              | Digit two        | 32       | 00110010   | 32                    |
| 3              | Digit three      | 33       | 00110011   | 33                    |
| 4              | Digit four       | 34       | 00110100   | 34                    |
| 5              | Digit five       | 35       | 00110101   | 35                    |
| 6              | Digit six        | 36       | 00110110   | 36                    |
| 7              | Digit seven      | 37       | 00110111   | 37                    |
| 8              | Digit eight      | 38       | 00111000   | 38                    |
| 9              | Digit nine       | 39       | 00111001   | 39                    |

## Development

This project is built with:

- SvelteKit
- TypeScript
- Pico CSS
