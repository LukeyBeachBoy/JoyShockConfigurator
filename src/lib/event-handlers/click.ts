import type { ControllerConfiguration } from "../controller-configuration";
import { EventHelper } from "./event-helper";
import { Activators } from "../activators";

export default ({ event, config }: { event: Event, config: ControllerConfiguration }) => {
	const button = EventHelper.getButtonFromEvent(event);
	if (!button) return;

	console.log(config.bindings[Activators[button.id]]);
}