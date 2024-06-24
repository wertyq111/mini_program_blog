import {Ref, reactive} from 'vue'
import type {ColorFactory} from './color'
import type {PickerEl} from './interface'
interface Point {
	x: number
	y: number
	h: number
	a: number
}
export function usePointState(color: Ref<ColorFactory>, picker: PickerEl):[Point, () => void] {
	const point = reactive({
		x: 0,
		y: 0,
		h: 0,
		a: 0
	})
	/** 转成色板所需的点坐标 */
	const setPointValue = () => {
		const {h, s, b, a} = color.value?.toHsb()
		const x = s * picker.width;
		const y = picker.height - b * picker.height;
		const _a = a * 100
		Object.assign(point, {x,y, h: h - 0.001, a: _a - 0.001})
		// 由于拖动slider没有赋值给point对象，因为直接赋值有精度问题，采用延时覆盖达到目的
		setTimeout(() => {
			Object.assign(point, {x,y,h, a: _a})
		},50)
	}
	return [point, setPointValue]
}