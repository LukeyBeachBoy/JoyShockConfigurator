import type { Buttons } from "./buttons";

export type ChordBinding = {
    [x: string]: string;
}

export interface ButtonParameters {
    button: Buttons;
    press?: string;
    modeshift?: string;
    hold?: string;
    doublePress?: string;
    chord?: ChordBinding;
}

export class ButtonBinding {
    button: Buttons;
    press: string;
    modeshift: string;
    hold: string;
    doublePress: string;
    chords: ChordBinding;

    constructor({ button, press, modeshift, hold, doublePress, chord }: ButtonParameters) {
        this.button = button;
        this.press = press;
        this.modeshift = modeshift;
        this.hold = hold;
        this.doublePress = doublePress;
        if (chord) {
            this.chords = {};
            this.chords[Object.keys(chord)[0]] = Object.values(chord)[0];
        }
    };

    mergeWith(other: ButtonBinding) {
        const merged = new ButtonBinding({ button: other.button ?? this.button, press: other.press ?? this.press, modeshift: other.modeshift ?? this.modeshift, hold: other.hold ?? this.hold, doublePress: other.doublePress ?? this.doublePress });
        if (other.chords) {
            Object.keys(other.chords).forEach(key => merged.appendChordedBinding({ [key]: other.chords[key] }));
        }

        if (this.chords) {
            Object.keys(this.chords).forEach(key => merged.appendChordedBinding({ [key]: this.chords[key] }));
        }
        return merged;
    }

    toJSM() {
        let result = '';
        if (this.press) {
            result += `${this.button} = ${this.press}${this.hold ? ' ' + this.hold : ''}`;
        }
        if (this.doublePress) {
            result += `${this.button},${this.button} = ${this.doublePress}`;
        }
        if (this.chords) {
            Object.keys(this.chords).forEach(chord => result += `\n${this.button},${chord} = ${this.chords[chord]}`);
        }

        return result;
    };

    private appendChordedBinding(chord: ChordBinding) {
        if (!this.chords) this.chords = {};

        if (Object.keys(this.chords).includes(Object.keys(chord)[0])) {
            return;
        }

        Object.keys(chord).forEach(key => this.chords[key] = chord[key]);
    }

}