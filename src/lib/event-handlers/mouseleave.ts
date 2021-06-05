import { Activators } from "../activators";
import { EventHelper } from "./event-helper";

export default (event: Event) => {
	const button = EventHelper.getButtonFromEvent(event);
	if (!button) return;
	button.classList.remove('activator__hover');
}