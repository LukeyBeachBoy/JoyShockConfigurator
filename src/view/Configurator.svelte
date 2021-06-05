<script lang="ts">
	import FileNavigator from "./FileNavigator.svelte";
	import InlineSVG from "svelte-inline-svg";
	import { readFileSync } from "fs";
	import { BehaviorSubject, fromEvent } from "rxjs";
	import { onDestroy, onMount } from "svelte";
	import { filter, map, takeUntil } from "rxjs/operators";
	import clickHandler from '../lib/event-handlers/click';
	import hoverHandler from '../lib/event-handlers/mouseover';
	import mouseLeaveHandler from '../lib/event-handlers/mouseleave';
	import type { ControllerConfiguration } from "../lib/controller-configuration";
	import { JsmParser } from "../lib/jsm-parser";

	const controllerView = new BehaviorSubject<SVGElement>(null);
	const destroyedController = new BehaviorSubject<boolean>(null);

	const destroyed = destroyedController.pipe(filter(it => it === true));

	let selectConfig = false;
	let config: ControllerConfiguration;
	let controller = "dualsense";

	onMount(() => {
		const observer = new MutationObserver((mutationsList) => {
			if (mutationsList.some((mutation) => mutation.type === 'childList' && mutation.target.nodeName === 'svg')) {
				console.log('added controller view');
				controllerView.next(document.getElementById('controller-view') as SVGElement);
			}
		});

		observer.observe(document.querySelector('.container'), { childList: true, subtree: true });
	});

	onDestroy(() => destroyedController.next(true));

	$: {
		if ($controllerView) {
			addEventListeners($controllerView as SVGElement);
		}
	}

	function addEventListeners(svgElement: SVGElement) {
		fromEvent(svgElement, 'click')
			.pipe(
				takeUntil(destroyed),
				map(event => ({
					event,
					config
				}))
			)
			.subscribe(clickHandler);

		fromEvent(svgElement, 'mouseover')
			.pipe(takeUntil(destroyed))
			.subscribe(hoverHandler);

		fromEvent(svgElement, 'mouseout')
			.pipe(takeUntil(destroyed))
			.subscribe(mouseLeaveHandler);
	}

	function loadConfig({ detail: file }) {
		config = new JsmParser().parseConfigFile(readFileSync(file, { encoding: 'utf8' }));
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
        <InlineSVG src="assets/{controller}.svg"/>
    </div>
{/if}

<style global lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
  }

  svg {
    max-width: 100%;
    height: auto;
  }

  .activator {
    &:hover .fill {
      fill: blue;
    }
  }
</style>
