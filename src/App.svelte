<script lang="ts">
    import Configurator from "./view/Configurator.svelte";
    import FolderSelect from "./view/FolderSelect.svelte";
    import { Router } from '@roxi/routify';
    import { routes } from '../.routify/routes.js';
</script>

<main>
    <Router {routes}/>
</main>

<style>
    main {
        text-align: center;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        margin: 0 auto;
        background: rgb(9,73,100);
        background: radial-gradient(circle, rgba(9,73,100,1) 4%, rgba(14,38,63,1) 40%, rgba(8,15,32,1) 95%);
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
