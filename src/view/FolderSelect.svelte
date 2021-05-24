<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function selectFolder() {
    const [folder] = (window as any).electron.dialog.showOpenDialogSync({
      title: "Select your JSM folder",
      properties: ["openDirectory"],
    });
    localStorage.setItem("folderLocation", folder);
    dispatch('folderSelected', folder);
  }
</script>

<button on:click={selectFolder}>Select folder</button>
