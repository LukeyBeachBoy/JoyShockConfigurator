import { Activators, activatorsList } from "../activators";

export class EventHelper {
	static getButtonFromEvent(event: Event) {
		const target = (event.target as HTMLElement);
		let button;
		if (target.id in Activators) {
			button = target;
		} else if (activatorsList.includes(target.parentElement.id)) {
			button = target.parentElement;
		}
		return button;
	}
}