<script lang="ts">
	import { decode, encode } from '../lib/urncode40';

	let plain: string | undefined;
	let code40: string | undefined;

	function enc(): void {
		if (plain) {
			code40 = encode(plain);
		}
	}

	function dec(): void {
		if (code40) {
			plain = decode(code40);
		}
	}
</script>

<main>
	<input placeholder="Plain text" bind:value={plain} />
	<button on:click={enc}>Encode to URN Code 40</button>
	<button on:click={dec}>Decode from URN Code 40</button>
	<input placeholder="URN Code 40 encoded text" bind:value={code40} />
</main>
