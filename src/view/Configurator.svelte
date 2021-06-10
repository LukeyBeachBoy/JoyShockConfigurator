<script lang="ts">
	import FileNavigator from "./FileNavigator.svelte";
	import { readFileSync } from "fs";
	import { BehaviorSubject } from "rxjs";
	import { onDestroy } from "svelte";
	import { filter } from "rxjs/operators";
	import type { ControllerConfiguration } from "../lib/controller-configuration";
	import { JsmParser } from "../lib/jsm-parser";
	import DualsenseController from "../lib/controller-components/DualsenseController.svelte";
	import { EventHelper } from "../lib/event-handlers/event-helper";
	import { Activators } from "../lib/activators";

	const controllerView = new BehaviorSubject<SVGElement>(null);
	const destroyedController = new BehaviorSubject<boolean>(null);
	const configController = new BehaviorSubject<ControllerConfiguration>({ bindings: {}, settings: {} });

	const destroyed = destroyedController.pipe(filter(it => it === true));

	let selectConfig = false;
	let controller = "dualsense";

	onDestroy(() => {
		destroyedController.next(true);
		destroyedController.complete();
		configController.complete();
	});

	function onClick(event: MouseEvent) {
		const config = $configController as ControllerConfiguration;
		const button = EventHelper.getButtonFromEvent(event);
		if (!button) return;

		console.log(config.bindings[Activators[button.id]]);
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
            <DualsenseController on:click={onClick} src="assets/{controller}.svg"/>

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
