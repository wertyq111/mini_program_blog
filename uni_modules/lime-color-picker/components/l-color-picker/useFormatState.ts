import {Ref, reactive} from 'vue'
import type {ColorFactory} from './color'
import { getAlphaColor, getHex, getFormatColor} from './util'
type ModeType = 'HEX' | 'RGB' | 'HSB'
interface Mode {
	value: string
	type: ModeType
	types: ModeType[]
	HEX: string[]
	RGB: number[]
	HSB: number[]
	a: number
}
export function useFormatState(color: Ref<ColorFactory>, fn?:(type: ModeType) => void): [Mode, () => void, () => void] {
	const MODES:ModeType[] = ['HEX', 'RGB', 'HSB']
	let modeIndex  = 0
	const mode = reactive<Mode>({
		type: MODES[0],
		types: MODES,
		value: '',
		HEX: [''],
		RGB: [0,0,0],
		HSB: [0,0,0],
		a: 0
	})
	const setFormatValue = () => {
		mode.value = color.value.toHexString();
		mode.HEX = [getHex(mode.value)]
		mode.RGB = getFormatColor(color.value.toRgbString()) 
		mode.HSB = getFormatColor(color.value.toHsbString()) 
		mode.a = getAlphaColor(color.value)
	}
	const onFormatChange = () => {
		modeIndex++
		mode.type = MODES[modeIndex % MODES.length];
		fn(mode.type)
	}
	return [mode, setFormatValue, onFormatChange]
}