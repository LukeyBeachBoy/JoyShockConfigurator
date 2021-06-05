import {expect, test, describe} from '@jest/globals';
import {Activators} from '../src/lib/activators';
import {JsmBinding} from '../src/lib/jsm-binding';

describe('📤 ButtonBinding objects can be outputted into JSM format', () => {
    test('Simple button press is correctly formatted', () => {
        const pressBinding = new JsmBinding({
            activator: Activators.MIC,
            press: 'MUTE'
        });
        expect(pressBinding.toJSM()).toBe('MIC = MUTE');
    });
});