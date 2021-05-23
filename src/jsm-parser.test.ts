import { expect, test, describe } from '@jest/globals';
import { ButtonBinding } from './button-binding';
import { Buttons } from './buttons';
import './jsm-parser';
import { JsmParser } from './jsm-parser';

const parser = new JsmParser();
const exampleFileLines = {
    singlePress: 'LUP = W',
    hold: 'W = R NONE',
    chorded: 'L,W = 1',
};

describe('📩 JSM files can be parsed into ButtonBinding objects', () => {
    test('Simple button press command is recognised', () => {
        const parsedBinding: ButtonBinding = parser.parseLine(exampleFileLines.singlePress);
        expect(parsedBinding).toHaveProperty('press', 'W');
        expect(parsedBinding).toHaveProperty('button', Buttons.LUP);
    });

    test('Hold press is correctly parsed and single press is unaffected', () => {
        const parsedBinding: ButtonBinding = parser.parseLine(exampleFileLines.hold);
        expect(parsedBinding).toHaveProperty('press', 'R');
        expect(parsedBinding).toHaveProperty('hold', 'NONE');
    });

    test('Chorded press is correctly parsed', () => {
        const parsedBinding: ButtonBinding = parser.parseLine(exampleFileLines.chorded);
        expect(parsedBinding).toHaveProperty('chords.W', '1');
    });

    test('Press binding can be merged with a Chorded binding', () => {
        const pressBinding: ButtonBinding = parser.parseLine('L = SPACE');
        expect(pressBinding).toHaveProperty('press', 'SPACE');

        const chordedBinding: ButtonBinding = parser.parseLine(exampleFileLines.chorded);

        const mergedBindings: ButtonBinding = chordedBinding.mergeWith(pressBinding);
        expect(mergedBindings).toHaveProperty('press', 'SPACE');
        expect(mergedBindings).toHaveProperty('chords.W', '1');
    });
});

describe('📤 ButtonBinding objects can be outputted into JSM format', () => {
    test('Simple button press is correctly formatted', () => {
        const pressBinding = new ButtonBinding({ button: Buttons.MIC, press: 'MUTE' });
        expect(pressBinding.toJSM()).toBe('MIC = MUTE');
    });
});



