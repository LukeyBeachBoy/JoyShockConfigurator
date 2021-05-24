import { ButtonBinding } from "./button-binding";
import { Buttons } from "./buttons"; 
export class JsmParser {
    // Remove whitespace and split string by punctuation e.g W = GYRO_OFF #Turns off gyro when holding square -> {button: w, command: GYRO_OFF, comments: 'Turns off gyro when holding square'}
    parseLine(line: string) {
        const commentsPosition = line.trim().indexOf('#');

        const binding = line.trim().substring(0, commentsPosition === -1 ? line.trim().length : commentsPosition);

        const [buttonOrChord, command] = binding.split('=');

        const [press, hold = null] = command.trim().split(' ').map(it => it.trim()).map(it => it === '' ? null : it);

        const [button, chord] = buttonOrChord.split(',').map(it => it.trim());

        return new ButtonBinding({
            button: Buttons[button],
            press: chord ? null : press ?? hold,
            modeshift: null,
            hold: hold,
            doublePress: button === chord ? press : null,
            chord: chord ? { [chord]: press } : null
        });
    }
}