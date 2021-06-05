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
		console.log(config);
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
        <div class="binding-label left-trigger">Left Trigger</div>
        <div class="binding-label right-trigger">Right Trigger</div>
        <div class="binding-label left-bumper">Left Bumper</div>
        <div class="binding-label right-bumper">Right Bumper</div>
        <div class="binding-label select">Select</div>
        <div class="binding-label start">Start</div>
        <div class="binding-box dpad">Dpad</div>
        <div class="binding-box left-joystick">Left Joystick</div>
        <div class="binding-box right-joystick">Right Joystick</div>
        <div class="binding-box face-buttons">Facebuttons</div>
        <InlineSVG src="assets/{controller}.svg"/>
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
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
  }
  
  .binding-label, .binding-box {
    position: absolute;
    color: #01c9ee;
  }
  
  .left-trigger {
    left: 10%;
    top: 20%;
  }
  
  .right-trigger {
    right: 10%;
    top: 20%;
  }
  
  .left-bumper {
    left: 10%;
    top: 25%;
  }
  
  .right-bumper {
    right: 10%;
    top: 25%;
  }
  
  .select {
    left: 10%;
    top: 30%;
  }
  
  .start {
    right: 10%;
    top: 30%;
  }
  
  .dpad {
    left: 10%;
    top: 85%;
  }
  
  .left-joystick {
    left: 32.5%;
    top: 85%;
  }
  
  .right-joystick {
    right: 32.5%;
    top: 85%;
  }
  
  .face-buttons {
    right: 10%;
    top: 85%;
  }

  svg {
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
