import type { HSVA, Numberify } from './tinycolor/interfaces';
import { TinyColor } from './tinycolor';
import type { ColorGenInput, HSBA } from './interface';
import { convertHsb2Hsv, getRoundNumber, getHex } from './util';
export class Color extends TinyColor {
	constructor(color : ColorGenInput) {
		super(convertHsb2Hsv(color));
	}

	toHsbString() {
		const hsb = this.toHsb();
		const saturation = getRoundNumber(hsb.s * 100);
		const lightness = getRoundNumber(hsb.b * 100);
		const hue = getRoundNumber(hsb.h);
		const alpha = hsb.a;
		const hsbString = `hsb(${hue}, ${saturation}%, ${lightness}%)`;
		const hsbaString = `hsba(${hue}, ${saturation}%, ${lightness}%, ${alpha.toFixed(
			alpha === 0 ? 0 : 2,
		)})`;
		return alpha === 1 ? hsbString : hsbaString;
	}

	toHsb() : Numberify<HSBA> {
		let hsv = this.toHsv();
		if (typeof this.originalInput === 'object' && this.originalInput) {
			if ('h' in this.originalInput) {
				hsv = this.originalInput as Numberify<HSVA>;
			}
		}

		const { v, ...resets } = hsv;
		return {
			...resets,
			b: hsv.v,
		};
	}
	// toHex() {
	// 	return getHex(this.toHexString(), this.getAlpha() < 1);
	// }
	// toHexString() {
	// 	return this.getAlpha() === 1
	// 		? this.toHexString()
	// 		: this.toHex8String();
	// }
	// toRgb() {
	// 	return this.toRgb();
	// }
	// toRgbString() {
	// 	return this.toRgbString();
	// }
}


export class ColorFactory {
	/** Original Color object */
	 metaColor : Color;

	constructor(color : ColorGenInput<Color>) {
		this.metaColor = new Color(color as ColorGenInput);
	}
	getAlpha() {
		return this.metaColor.getAlpha()
	}
	toHsb() {
		return this.metaColor.toHsb();
	}

	toHsbString() {
		return this.metaColor.toHsbString();
	}

	toHex() {
		return getHex(this.toHexString(), this.getAlpha() < 1);
	}

	toHexString() {
		return this.getAlpha() === 1
			? this.metaColor.toHexString()
			: this.metaColor.toHex8String();
	}

	toRgb() {
		return this.metaColor.toRgb();
	}

	toRgbString() {
		return this.metaColor.toRgbString();
	}
}