import { expect, test, describe } from '@jest/globals';
import type { JsmBinding } from '../src/lib/jsm-binding';
import { Activators } from '../src/lib/activators';
import { JsmParser } from '../src/lib/jsm-parser';
import type { JsmSetting } from "../src/lib/jsm-setting";

const fs = require('fs');

const parser = new JsmParser();
const exampleFileLines = {
	singlePress: 'LUP = W',
	hold: 'W = R NONE',
	chorded: 'L,W = 1',
};

describe('📩 Lines within JSM files can be parsed into JsmBinding objects', () => {
	test('Simple button press command is recognised', () => {
		const parsedBinding: JsmBinding = parser.parseLine(exampleFileLines.singlePress) as JsmBinding;
		expect(parsedBinding).toHaveProperty('press', 'W');
		expect(parsedBinding).toHaveProperty('activator', Activators.LUP);
	});

	test('Hold press is correctly parsed and single press is unaffected', () => {
		const parsedBinding: JsmBinding = parser.parseLine(exampleFileLines.hold) as JsmBinding;
		expect(parsedBinding).toHaveProperty('press', 'R');
		expect(parsedBinding).toHaveProperty('hold', 'NONE');
	});

	test('Chorded press is correctly parsed', () => {
		const parsedBinding: JsmBinding = parser.parseLine(exampleFileLines.chorded) as JsmBinding;
		expect(parsedBinding).toHaveProperty('chords.W', '1');
	});

	test('Press binding can be merged with a Chorded binding', () => {
		const pressBinding: JsmBinding = parser.parseLine('L = SPACE') as JsmBinding;
		expect(pressBinding).toHaveProperty('press', 'SPACE');

		const chordedBinding: JsmBinding = parser.parseLine(exampleFileLines.chorded) as JsmBinding;

		const mergedBindings: JsmBinding = chordedBinding.mergeWith(pressBinding);
		expect(mergedBindings).toHaveProperty('press', 'SPACE');
		expect(mergedBindings).toHaveProperty('chords.W', '1');
	});
});

describe('Setting configurations are parsed to JsmSetting objects', () => {
	test('REAL_WORLD_CALIBRATION is detected as a Setting and is parsed correctly', () => {
		const setting: JsmSetting = parser.parseLine('REAL_WORLD_CALIBRATION = 150') as JsmSetting;
		expect(setting).toHaveProperty('value', "150");
	});
});

describe('A complete JSM file can be parsed to a ControllerConfiguration object', () => {
	test('Small file can be parsed', () => {
		const file: string = fs.readFileSync('G:\\Programs\\JSM\\AutoLoad\\BlackOpsColdWar.txt', { encoding: 'utf-8' });
		const config = parser.parseConfigFile(file);
		console.log(config);
	});
});



