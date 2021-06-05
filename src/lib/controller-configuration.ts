import type { Activators } from "./activators";
import type { JsmBinding } from "./jsm-binding";
import type { Settings } from "./settings";

export type ControllerConfiguration = {
	settings: {
		[key in Settings]?: string
	},
	bindings: {
		[key in Activators]?: JsmBinding;
	}
};