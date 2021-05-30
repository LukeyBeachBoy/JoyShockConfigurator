import {expect, test, describe} from '@jest/globals';
import {Buttons} from '../src/lib/buttons';
import {ButtonBinding} from '../src/lib/button-binding';

describe('📤 ButtonBinding objects can be outputted into JSM format', () => {
    test('Simple button press is correctly formatted', () => {
        const pressBinding = new ButtonBinding({
            button: Buttons.MIC,
            press: 'MUTE'
        });
        expect(pressBinding.toJSM()).toBe('MIC = MUTE');
    });
});