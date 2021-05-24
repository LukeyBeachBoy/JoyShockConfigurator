<script lang="ts">
  import Configurator from "./view/Configurator.svelte";
  import FolderSelect from "./view/FolderSelect.svelte";

  let folderLocation = localStorage.getItem("folderLocation");
</script>

<main>
  {#if folderLocation}
  <Configurator />
  {:else}
  <h1>Find your JSM folder</h1>
  <FolderSelect
      on:folderSelected={(event) => (folderLocation = event.detail)}
    />
  {/if}
</main>

<style>
  main {
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
