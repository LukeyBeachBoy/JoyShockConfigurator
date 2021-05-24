<script lang="ts">
  import { readdir, stat } from "fs";
  import { createEventDispatcher, onMount } from "svelte";
  import { BehaviorSubject } from "rxjs";

  const _files = new BehaviorSubject([]);
  const jsmFolder = localStorage.getItem("folderLocation");
  let selectedDirectory = "GyroConfigs";

  const dispatch = createEventDispatcher();

  $: {
    readdir(
      `${jsmFolder}/${selectedDirectory}`,
      (err: Error, files: [string]) => {
        console.log(files);
        _files.next(files);
      }
    );
  }
</script>

<div class="directory-selector">
  <span
    class:active={selectedDirectory === "Autoload"}
    on:click={() => (selectedDirectory = "Autoload")}
  >
    Autoload
  </span>
  <span
    class:active={selectedDirectory === "GyroConfigs"}
    on:click={() => (selectedDirectory = "GyroConfigs")}
  >
    GyroConfigs
  </span>
</div>

<div>
  {#each $_files as file}
    <div class="file" on:click={() => dispatch('configSelected', `${jsmFolder}\\${selectedDirectory}\\${file}`)}>
      {file}
    </div>
  {/each}
</div>

<style lang="scss">
  .directory-selector {
    display: flex;
    justify-content: center;
    gap: 25px;

    .active {
        color: red;
    }
  }
</style>
