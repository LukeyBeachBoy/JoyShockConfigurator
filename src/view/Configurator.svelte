<script lang="ts">
	import FileNavigator from "./FileNavigator.svelte";
	import InlineSVG from "svelte-inline-svg";
	import { readFileSync } from "fs";
	import { BehaviorSubject, fromEvent } from "rxjs";
	import { onDestroy, onMount } from "svelte";
	import { filter, map, switchMap, takeUntil } from "rxjs/operators";
	import clickHandler from '../lib/event-handlers/click';
	import hoverHandler from '../lib/event-handlers/mouseover';
	import mouseLeaveHandler from '../lib/event-handlers/mouseleave';
	import type { ControllerConfiguration } from "../lib/controller-configuration";
	import { JsmParser } from "../lib/jsm-parser";

	const controllerView = new BehaviorSubject<SVGElement>(null);
	const destroyedController = new BehaviorSubject<boolean>(null);
	const configController = new BehaviorSubject<ControllerConfiguration>({ bindings: {}, settings: {} });

	const destroyed = destroyedController.pipe(filter(it => it === true));

	let selectConfig = false;
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

	onDestroy(() => {
		destroyedController.next(true);
		destroyedController.complete();
		configController.complete();
	});

	$: {
		if ($controllerView) {
			addEventListeners($controllerView as SVGElement);
		}
		if ($configController) {
			console.log($configController);
		}
	}

	function addEventListeners(svgElement: SVGElement) {
		fromEvent(svgElement, 'click')
			.pipe(
				takeUntil(destroyed),
				switchMap(event => configController.pipe(map(it => ({ event, config: it }))))
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
		const parsed = new JsmParser().parseConfigFile(readFileSync(file, { encoding: 'utf8' }));
		configController.next(parsed);
		selectConfig = false;
	}

</script>

<div class="menu">
    <button class="btn" on:click={() => (selectConfig = true)}>Load config</button>
</div>
{#if selectConfig}
    <FileNavigator on:configSelected={loadConfig}/>
{:else}
    <div class="container">
        <section class="top-panel">
            <section class="left-panel">
                <div class="binding-label left-trigger">Left Trigger</div>
                <div class="binding-label left-bumper">Left Bumper</div>
                <div class="binding-label select">Select</div>
            </section>
            <InlineSVG src="assets/{controller}.svg"/>

            <section class="right-panel">
                <div class="binding-label right-trigger">Right Trigger</div>
                <div class="binding-label right-bumper">Right Bumper</div>
                <div class="binding-label start">Start</div>
            </section>
        </section>

        <section class="bottom-panel">
            <div class="binding-box dpad">
                <p>DPAD</p>
                {#if Object.keys(($configController).bindings).length !== 0}
                    {#each Object.keys(($configController).bindings).filter(it => [ 'UP', 'DOWN', 'LEFT', 'RIGHT' ].includes(
						it)) as binding}
                        <p>{binding} => {$configController.bindings[binding]?.press}</p>
                    {/each}
                {/if}
            </div>
            <div class="binding-box left-joystick">Left Joystick</div>
            <div class="binding-box right-joystick">Right Joystick</div>
            <div class="binding-box face-buttons">Facebuttons</div>
        </section>
    </div>
{/if}

<style global lang="scss">

  .menu {
    z-index: 2;
    display: flex;
    padding: 8px;
  }

  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-height: 100%;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }

  .top-panel {
    display: flex;
  }

  .binding-label, .binding-box {
    position: absolute;
    color: #01c9ee;
  }

  .left-panel {
    grid-area: LP;
  }

  .right-panel {
    grid-area: RP;
  }

  .bottom-panel {
    grid-area: BP
  }

  svg {
    grid-area: controller;
    max-width: 50%;
    max-height: 50%;
    height: auto;
  }

  .activator {
    &:hover .fill {
      fill: blue;
    }
  }
</style>
