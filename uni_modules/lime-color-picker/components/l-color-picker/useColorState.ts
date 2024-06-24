
import { ref, Ref } from 'vue'
import type { ColorGenInput } from './interface';
import { generateColor } from './util';
import type { ColorFactory } from './color';
type ColorValue = ColorGenInput | undefined;


function hasValue(value : ColorValue) {
	return value !== undefined;
}
export function useColorState(
	defaultStateValue : ColorValue,
	option : {
		defaultValue ?: ColorValue;
		value ?: ColorValue;
		immediate?: Boolean
	},
):[Ref<ColorFactory>, (color?: ColorValue) => void] {
	const { defaultValue, value, immediate } = option;
	const colorValue = ref<ColorFactory>()
	const setColorValue = (color?: ColorValue) => {
		let mergeState: ColorValue;
		if(hasValue(color)) {
			mergeState = color;
		} else if (hasValue(value)) {
			mergeState = value;
		} else if (hasValue(defaultValue)) {
			mergeState = defaultValue;
		} else {
			mergeState = defaultStateValue;
		}
		colorValue.value = generateColor(mergeState);
		
	}
	if(immediate) {
		setColorValue()
	}
	return [colorValue, setColorValue];
}