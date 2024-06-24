import {PropType} from 'vue'
interface Presets {
	label: string
	colors: string[]
}
export default {
	// type: {
	// 	type: String,
	// 	default: 'square' // circle | square
	// },
	value: String,
	modelValue: String,
	defaultColor: String,
	disabled: Boolean,
	/**预设颜色*/
	presets: {
		type: Array as PropType<Presets[]>
	}
}