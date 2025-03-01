<script lang="ts">
	import { decode, encode, validate } from '$lib/urncode40';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let plainText: string = '';
	let encodedText: string = '';
	let resultMessage: string = '';
	let messageType: 'success' | 'error' | '' = '';
	let messageTimer: ReturnType<typeof setTimeout>;

	// Clear message after some time
	function showMessage(message: string, type: 'success' | 'error') {
		clearTimeout(messageTimer);
		resultMessage = message;
		messageType = type;
		messageTimer = setTimeout(() => {
			resultMessage = '';
			messageType = '';
		}, 5000);
	}

	function handleEncode(): void {
		if (!plainText.trim()) {
			showMessage('Please enter some text to encode.', 'error');
			return;
		}

		if (!validate(plainText)) {
			showMessage(
				'Input contains invalid characters. The encoding supports A-Z, 0-9, space, hyphen, period, colon, and with extended encoding most Unicode characters.',
				'error'
			);
			return;
		}

		const result = encode(plainText);
		if (result) {
			encodedText = result;
			showMessage('Text encoded successfully!', 'success');
		} else {
			showMessage('Encoding failed. Please check your input.', 'error');
		}
	}

	function handleDecode(): void {
		if (!encodedText.trim()) {
			showMessage('Please enter encoded text to decode.', 'error');
			return;
		}

		// Basic validation for encoded text (must be hex and multiple of 4)
		if (!/^[0-9A-Fa-f]+$/.test(encodedText) || encodedText.length % 4 !== 0) {
			showMessage(
				'Invalid encoded format. Must be hexadecimal and length must be multiple of 4.',
				'error'
			);
			return;
		}

		const result = decode(encodedText);
		if (result) {
			plainText = result;
			showMessage('Text decoded successfully!', 'success');
		} else {
			showMessage('Decoding failed. Please check your input.', 'error');
		}
	}

	function copyToClipboard(text: string): void {
		navigator.clipboard
			.writeText(text)
			.then(() => showMessage('Copied to clipboard!', 'success'))
			.catch(() => showMessage('Failed to copy to clipboard.', 'error'));
	}

	function clearFields(): void {
		plainText = '';
		encodedText = '';
		resultMessage = '';
		messageType = '';
	}

	onMount(() => {
		// Try to get previously entered data from local storage
		const savedPlain = localStorage.getItem('urncode40_plainText');
		const savedEncoded = localStorage.getItem('urncode40_encodedText');

		if (savedPlain) plainText = savedPlain;
		if (savedEncoded) encodedText = savedEncoded;
	});

	// Save current data to local storage
	$: {
		if (typeof window !== 'undefined') {
			localStorage.setItem('urncode40_plainText', plainText);
			localStorage.setItem('urncode40_encodedText', encodedText);
		}
	}
</script>

<main>
	<article class="grid">
		<div>
			<h2>Plain Text</h2>
			<textarea
				placeholder="Enter text to encode (supports basic characters and extended Unicode with special encoding)"
				bind:value={plainText}
				rows="5"
			></textarea>

			<div class="actions">
				<button class="primary" on:click={handleEncode}>Encode ↓</button>
				<button class="outline" on:click={() => copyToClipboard(plainText)}> Copy </button>
			</div>
		</div>

		<div>
			<h2>URN Code 40 Encoded</h2>
			<textarea
				placeholder="Enter URN Code 40 encoded text to decode"
				bind:value={encodedText}
				rows="5"
			></textarea>

			<div class="actions">
				<button class="primary" on:click={handleDecode}>Decode ↑</button>
				<button class="outline" on:click={() => copyToClipboard(encodedText)}> Copy </button>
			</div>
		</div>
	</article>

	<div class="controls">
		<button class="secondary outline" on:click={clearFields}>Clear All</button>
	</div>

	{#if resultMessage}
		<div class="message {messageType}" role="alert" transition:fade={{ duration: 200 }}>
			{resultMessage}
		</div>
	{/if}

	<div class="info-box">
		<details>
			<summary>About URN Code 40</summary>
			<p>
				URN Code 40 is an encoding scheme that provides a method to encode data in conformity with
				the urn:oid namespace scheme.
			</p>
			<p>It compacts three characters into two bytes (four hex digits) using the formula:</p>
			<code>(1600*C1) + (40*C2) + C3 + 1</code>
			<strong>Basic Character Set:</strong> A-Z, 0-9, space, hyphen (-), period (.) and colon (:).
			<h4>Extended Encoding</h4>
			<p>URN Code 40 also supports extended encoding for additional characters and features:</p>
			<ul>
				<li>
					<strong>FB:</strong> Long numeric strings (9-24 digits) are encoded more efficiently
				</li>
				<li><strong>FC:</strong> ISO/IEC 646 characters not in the base table</li>
				<li><strong>FD:</strong> Double-byte UTF-8 characters</li>
				<li><strong>FE:</strong> Triple-byte UTF-8 characters</li>
			</ul>
			<p>
				This allows encoding most Unicode characters and improves efficiency for long numeric
				sequences.
			</p>
		</details>
	</div>
</main>

<style>
	textarea {
		width: 100%;
		font-family: monospace;
		resize: vertical;
	}

	.grid {
		gap: 2rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}

	.controls {
		margin: 2rem 0;
		display: flex;
		justify-content: center;
	}

	.message {
		padding: 1rem;
		border-radius: 0.5rem;
		text-align: center;
		margin: 1rem 0;
	}

	.success {
		background-color: rgba(0, 128, 0, 0.1);
		color: green;
	}

	.error {
		background-color: rgba(255, 0, 0, 0.1);
		color: darkred;
	}

	.info-box {
		margin-top: 2rem;
		padding: 1rem;
		border-radius: 0.5rem;
		background-color: rgba(0, 0, 0, 0.05);
	}

	details {
		margin-bottom: 1rem;
	}

	code {
		background-color: rgba(0, 0, 0, 0.1);
		padding: 0.2rem 0.4rem;
		border-radius: 0.3rem;
	}

	ul {
		margin-top: 0.5rem;
		padding-left: 1.5rem;
	}

	h4 {
		margin: 1rem 0 0.5rem 0;
	}
</style>
