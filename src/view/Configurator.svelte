<script lang="ts">
	import FileNavigator from "./FileNavigator.svelte";
	import InlineSVG from "svelte-inline-svg";
	import { readFileSync } from "fs";
	import { BehaviorSubject, fromEvent } from "rxjs";
	import { onDestroy, onMount } from "svelte";
	import { filter, map, switchMap, takeUntil } from "rxjs/operators";
	import clickHandler from '../lib/event-handlers/click';
	import type { ControllerConfiguration } from "../lib/controller-configuration";
	import { JsmParser } from "../lib/jsm-parser";

	const controllerView = new BehaviorSubject<SVGElement>(null);
	const destroyedController = new BehaviorSubject<boolean>(null);
	const configController = new BehaviorSubject<ControllerConfiguration>({ bindings: {}, settings: {} });

	const destroyed = destroyedController.pipe(filter(it => it === true));

	let selectConfig = false;
	let controller = "dualsense";

	onMount(() => {
		const observer = new MutationObserver((mutationsList, self) => {
			if (mutationsList.some((mutation) => mutation.type === 'childList' && mutation.target.nodeName === 'svg')) {
				const controllerSvg = document.getElementById('controller-view') as SVGElement;
                addEventListeners(controllerSvg);
				controllerView.next(controllerSvg);
				self.disconnect();
			}
		});

		observer.observe(document.querySelector('.container'), { childList: true, subtree: true });
	});

	onDestroy(() => {
		destroyedController.next(true);
		destroyedController.complete();
		configController.complete();
	});

	function addEventListeners(svgElement: SVGElement) {
		fromEvent(svgElement, 'click')
			.pipe(
				takeUntil(destroyed),
				switchMap(event => configController.pipe(map(it => ({ event, config: it }))))
			)
			.subscribe(clickHandler);
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
        <div class="spacer"></div>
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
                DPAD
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
    width: 100%;
    max-height: 100%;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1 1 auto;
  }

  .spacer {
    flex: 1 1 auto;
  }

  .binding-label, .binding-box {
    color: #01c9ee;
  }

  .binding-label {
    padding: 25px;
    border-radius: 10px;
    &:hover {
      box-shadow: 0 0 12px 0px;
      background: #ffffff14;
    }
  }

  .binding-box {
    padding: 14px;
    margin: 8px;
    background: #80808038;
    border-radius: 8px;
    display: flex;
    flex: 1;
  }

  .top-panel {
    display: flex;
    flex: 1;

    .left-panel {
      text-align: left;
      flex: 1;
    }

    .right-panel {
      flex: 1;
      text-align: right;
    }
  }

  .bottom-panel {
    width: 100%;
    margin-top: 50px;
    display: flex;
    flex: 1;
  }

  svg {
    flex: 2;
    max-width: 70%;
    max-height: 100%;
    height: auto;
  }

  .activator {
    &:hover .outline {
      stroke: #0082ff;
      &__thick {
        stroke-width: 5px;
      }
    }
  }
</style>
