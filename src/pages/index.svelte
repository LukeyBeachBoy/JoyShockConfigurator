<script>
	import Configurator from "../view/Configurator.svelte";
	import FolderSelect from "../view/FolderSelect.svelte";

	let folderLocation = localStorage.getItem("folderLocation");
</script>
{#if folderLocation}
    <Configurator/>
{:else}
    <h1>Find your JSM folder</h1>
    <FolderSelect
            on:folderSelected={(event) => (folderLocation = event.detail)}
    />
{/if}