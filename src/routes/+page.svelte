<script lang="ts">
    let encoded: string;
    let decoded: string;

    function encode() : void {
        
    }

    function decode() : void {
        
    }
</script>

<main class="container">
    <h1>URN Code 40 encoder/decoder</h1>


    <input placeholder="Plain text" bind:value={encoded} />
    <button on:click={encode}>Encode to URN Code 40</button>
    <button on:click={decode}>Decode from URN Code 40</button>
    <input placeholder="URN Code 40 encoded text" bind:value={decoded} />
    <div style="color: red">Error: ...</div>
    

</main>

