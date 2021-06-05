import type { Activators } from "./activators";
import type { Settings } from "./settings";

export type ChordBinding = {
	[x: string]: string;
}

export interface BindingParameters {
	activator?: Activators;
	press?: string;
	modeshift?: string;
	hold?: string;
	doublePress?: string;
	chord?: ChordBinding;
}

export class JsmBinding {
	activator: Activators;
	press: string;
	modeshift: string;
	hold: string;
	doublePress: string;
	chords: ChordBinding;

	constructor({ activator, press, modeshift, hold, doublePress, chord }: BindingParameters) {
		this.activator = activator;
		this.press = press;
		this.modeshift = modeshift;
		this.hold = hold;
		this.doublePress = doublePress;
		if (chord) {
			this.chords = {};
			this.chords[Object.keys(chord)[0]] = Object.values(chord)[0];
		}
	};

	mergeWith(other: JsmBinding) {
		const merged = new JsmBinding({
			activator: other.activator ?? this.activator,
			press: other.press ?? this.press,
			modeshift: other.modeshift ?? this.modeshift,
			hold: other.hold ?? this.hold,
			doublePress: other.doublePress ?? this.doublePress
		});
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
			result += `${ this.activator } = ${ this.press }${ this.hold ? ' ' + this.hold : '' }`;
		}
		if (this.doublePress) {
			result += `${ this.activator },${ this.activator } = ${ this.doublePress }`;
		}
		if (this.chords) {
			Object.keys(this.chords).forEach(chord => result += `\n${ this.activator },${ chord } = ${ this.chords[chord] }`);
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