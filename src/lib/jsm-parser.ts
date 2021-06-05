import { JsmBinding } from "./jsm-binding";
import { Activators } from "./activators";
import type { ControllerConfiguration } from "./controller-configuration";
import { Settings } from "./settings";
import { JsmSetting } from "./jsm-setting";

export class JsmParser {
	lineIsConfigImport(line: string): boolean {
		return line.trim().endsWith('.txt');
	}

	parseConfigFile(file: string) {
		const config: ControllerConfiguration = { settings: {}, bindings: {} };
		file.split('\r\n')
			.filter(it => it != '')
			.forEach(it => {
				const parseResult = this.parseLine(it);
				if (parseResult instanceof JsmSetting) {
					config.settings[parseResult.setting] = parseResult.value;
				}

				if (parseResult instanceof JsmBinding) {
					config.bindings[parseResult.activator] = parseResult;
				}
			});
		return config;
	}

	// Remove whitespace and split string by punctuation e.g W = GYRO_OFF #Turns off gyro when holding square -> {button: w, command: GYRO_OFF, comments: 'Turns off gyro when holding square'}
	parseLine(line: string): JsmBinding | JsmSetting {
		const commentsPosition = line.trim().indexOf('#');

		const binding = line
			.trim()
			.substring(0, commentsPosition === -1 ? line.trim().length : commentsPosition);

		if (!binding.includes('=')) {
			// Means it is a COMMAND
			return;
		}

		const [buttonOrChordOrSetting, command] = binding.split('=');

		const [mapping, holdMapping = null] = command
			.trim()
			.split(' ')
			.map(it => it.trim())
			.map(it => it === '' ? null : it);

		const [button, chord] = buttonOrChordOrSetting.split(',').map(it => it.trim());

		if (button in Settings) {
			return new JsmSetting(Settings[button], mapping);
		}

		return new JsmBinding({
			activator: Activators[button],
			press: chord ? null : mapping ?? holdMapping,
			modeshift: null,
			hold: holdMapping,
			doublePress: button === chord ? mapping : null,
			chord: chord ? { [chord]: mapping } : null
		});
	}
}