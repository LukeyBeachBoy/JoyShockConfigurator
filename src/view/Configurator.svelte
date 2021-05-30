<script lang="ts">
  import { onMount } from "svelte";

  import FileNavigator from "./FileNavigator.svelte";
  import InlineSVG from "svelte-inline-svg";
import { readFileSync } from "fs";
  let selectConfig = false;
  let controller = "dualsense";
  let up: HTMLElement;

  onMount(async () => {
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    // Assign button path elements to variables
    up = document.getElementById("UP");
    // Add event handlers
    up.addEventListener("click", () => {
      console.log("yo");
    });
  });

  function loadConfig({detail: file}) {
      console.log(file);
      console.log(readFileSync(file, {encoding: 'utf8'}));
      selectConfig = false;
  }
</script>

<div class="menu">
  <button on:click={() => (selectConfig = true)}>Load config</button>
</div>
{#if selectConfig}
  <FileNavigator on:configSelected={loadConfig}/>
{:else}
  <div class="container">
    <InlineSVG src="assets/{controller}.svg" />
  </div>
{/if}

<style>
  .container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    justify-content: center;
  }
  :global(svg) {
    max-width: 100%;
    height: auto;
  }
</style>
