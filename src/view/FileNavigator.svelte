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
			`${ jsmFolder }/${ selectedDirectory }`,
			(err: Error, files: [string]) => {
				console.log(files);
				_files.next(files);
			}
		);
	}
</script>

<div class="directory-selector">
    <button class="btn"
            class:active={selectedDirectory === "Autoload"}
            on:click={() => (selectedDirectory = "Autoload")}
    >
        Autoload
    </button>
    <button class="btn"
            class:active={selectedDirectory === "GyroConfigs"}
            on:click={() => (selectedDirectory = "GyroConfigs")}
    >
        GyroConfigs
    </button>
</div>

<div class="config-list">
    {#each $_files as file}
        <div class="config-list__item"
             on:click={() => dispatch('configSelected', `${jsmFolder}\\${selectedDirectory}\\${file}`)}>
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
      color: #01c9ee;
    }

  }

  .config-list {
    display: flex;
    flex-direction: column;
    background: #32354a30;
    margin: 35px 25vw;
    &__item {
      color: white;
      padding: 10px;
      cursor: pointer;
      &:hover {
        color: #01c9ee;
      }
    }
  }
</style>
