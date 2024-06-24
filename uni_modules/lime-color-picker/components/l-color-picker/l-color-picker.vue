<template>
	<view class="l-color-picker">
		<view class="l-color-picker-select">
			<view class="l-color-picker-saturation" :style="'background-color:' + hueColor"></view>
			<movable-area class="l-color-picker-palette">
				<movable-view 
					class="l-color-picker-handler" 
					direction="all"
					:x="point.x"
					:y="point.y"
					:animation="false"
					:disabled="props.disabled"
					@change="onChangeSB">
				</movable-view>
			</movable-area>
		</view>
		<view class="l-color-picker-slider-container">
			<view class="l-color-picker-slider-group">
				<l-color-picker-slider :disabled="props.disabled" :value="point.h" type="hue" :max="360" @change="onChangeHue"></l-color-picker-slider>
				<l-color-picker-slider :disabled="props.disabled" :value="point.a" :activeColor="colors.rgb" type="alpha" @change="onChangeAlpha"></l-color-picker-slider>
			</view>
			<view class="l-color-picker-color-block">
				<view class="l-color-picker-color-block-inner" :style="'background-color:' + colors.rgba"></view>
			</view>
		</view>
		<view class="l-color-picker-input-container">
			<view class="l-color-picker-format-select" @click="onFormatChange">
				<text>{{mode.type}}</text>
				<image style="width: 24px; height: 24px;padding-left: 8rpx" src="data:image/png;base64,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+8iQghBkCC0la8eWxKocu3UjiJJHPzTmWJJYlgNBhr46Zes3lcS6HAii7MGXxC2VBDn+oc0/sUpenbKZoZIgx38FI4iyx14at68kyPF/wghS+uIUzh0lCXLcWCqCKHzom0Q+SBLk2J8qgmzy2pTO7pUEOQ4uEkGUPvJNY/8rCXIcThJBNn1piud3JZHwXy1LRoggktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCCNK8AgJIJoAgktshW3MCfwH5KlHn7EPsuAAAAABJRU5ErkJggg=="></image>
			</view>
			<view class="l-color-picker-input">
				<view class="l-color-picker-input-item" v-for="(item, index) in mode[mode.type]" :key="mode.type + index">
					<text class="l-symbol" v-if="mode.type == 'HEX'">#</text>
					<input :disabled="props.disabled" :type="mode.type == 'HEX' ? 'text' :'number'" :value="mode[mode.type][index]" @input="onInput($event, index)" />
					<text class="l-symbol" v-if="mode.type == 'HSB' && index">%</text>
				</view>
			</view>
			<view class="l-color-picker-input-item l-color-picker-input-alpha">
				<input :disabled="props.disabled" type="number" :value="mode.a" @input="onInput($event, 'a')">
				<text class="l-symbol">%</text>
			</view>
		</view>
		<view class="l-color-picker-presets">
			<view class="l-color-picker-presets-box" v-for="list in props.presets" :key="list.label">
				<view class="l-color-picker-presets-label" v-if="list.label">{{list.label}}</view>
				<view class="l-color-picker-presets-items">
					<block v-if="list.colors.length">
						<view
							class="l-color-picker-color-block l-color-picker-presets-color"
							:class="{'l-color-picker-presets-color-checked': [colors.rgba, colors.hsb, colors.hex, colors.HEX].includes(item)}"
							v-for="item in list.colors" :key="item" @click="onPreset(item)">
							<view class="l-color-picker-color-block-inner" :style="'background-color:' + item"></view>
						</view>
					</block>
					<text v-else class="l-color-picker-presets-empty">暂无</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script lang="ts">
	import { defineComponent, onMounted, getCurrentInstance, reactive, watch, computed, onUnmounted} from 'vue';
	import ColorPickerProps from './props';
	import { useColorState } from './useColorState';
	import { usePointState } from './usePointState';
	import { useFormatState } from './useFormatState';
	import { useState } from './useState';
	import { generateColor , getAlphaColor } from './util';
	import { getRect } from '@/uni_modules/lime-shared/getRect';
	import { debounce } from '@/uni_modules/lime-shared/debounce';
	import { throttle } from '@/uni_modules/lime-shared/throttle';
	const name = 'l-color-picker';
	export default defineComponent({
		props: ColorPickerProps,
		name,
		emits: ['change', 'formatChange', 'update:modelValue'],
		setup(props, {emit}) {
			const context = getCurrentInstance();
			const picker = reactive({
				height: 0,
				width: 0,
				radius: 0,
			})
			const [isInput, changeState] = useState()
			const [color, setColorValue] = useColorState('#1677ff', {value: props.value || props.modelValue, defaultValue: props.defaultColor, immediate: true});
			const [point, setPointValue] = usePointState(color, picker)
			const [mode, setFormatValue, onFormatChange] = useFormatState(color, (type) => emit('formatChange', type))
			
			const hueColor = computed(() =>{
				const {h = 0} = colors.value.Hsb
				return generateColor({
					h,
					s: 100,
					b: 100
				}).toRgbString()
			})
			const colors = computed(() => {
				const rgba = color.value?.toRgbString();
				const hex = color.value?.toHexString();
				return {
					rgba,
					rgb: rgba?.replace(/\d(\.\d+)?\)$/, '1)'),
					hex,
					HEX: hex.toUpperCase(),
					hsb: color.value?.toHsbString(),
					a: getAlphaColor(color.value),
					Hsb: color.value.toHsb(),
					Rgb: color.value.toRgb(),
				}
			})
			
			const setHsbValue = (hsba: {s?: number, b?: number, h?: number, a?: number}) => {
				setColorValue(Object.assign({}, colors.value.Hsb, hsba))
			}
			
			const onChangeSB = ({detail}: WechatMiniprogram.TouchEvent) => {
				if(isInput.value) return
				const {x, y} = detail
				const s = Math.max(0, x / picker.width )
				const b = Math.max(0, 1 - y / picker.height )
				setHsbValue({s, b})
				setFormatValue()
			}
			const onChangeHue = (h: number) => {
				if(isInput.value) return
				setHsbValue({h})
				setFormatValue()
			}
			const onChangeAlpha = (a: number) => {
				if(isInput.value) return
				setHsbValue({a: a / 100})
				setFormatValue()
			}
		
			
			const onInput = debounce((e: WechatMiniprogram.TouchEvent, key: string | number) => {
				changeState()
				const { value } = e.detail
				if(key == 'a') {
					setHsbValue({a: value / 100})
					Object.assign(point, {a: Number(value)})
				} else if(mode.type == mode.types[0]){
					if([3,6,8].includes(value.length)) {
						setColorValue(value)
						setPointValue()
					}
				}  else {
					const isRgb = mode.type == mode.types[1]
					const keys = mode.type.toLowerCase().split('')
					const obj = isRgb ? colors.value?.Rgb : colors.value?.Hsb;
					obj[keys[key]] = Number(key > 0 && !isRgb ? value / 100 : value);
					setColorValue(obj)
					setPointValue()
				}
			})
			
			const onPreset = (color: string) => {
				if(props.disabled) return
				changeState()
				setColorValue(color)
				setPointValue()
				setFormatValue()
			}
			const stopWatchValue = watch(() => props.modelValue, (v) => {
				if(v !== mode.value) {
					setColorValue(v)
					setPointValue()
				}
			})
			const stopWatch = watch(color, (v) => {
				emit('change', v)
				if(props.modelValue && props.modelValue !== mode.value) {
					emit('update:modelValue', mode.value)
				}
			})
			const getPickerSize = throttle(() => {
				Promise.all(['palette', 'handler'].map(item => getRect(`.${name}-${item}`, {context}))).then(([palette, handler]) => {
					picker.width = Number(palette.width.toFixed(2)) - handler.width
					picker.height = Number(palette.height.toFixed(2)) - handler.height
					
					setPointValue()
					setFormatValue()
				})
			}, 300)
			onUnmounted(() => {
				stopWatch()
				stopWatchValue()
			})
			onMounted(getPickerSize)
			return {
				props,
				color,
				hueColor,
				colors,
				point,
				mode,
				onChangeSB,
				onChangeHue,
				onChangeAlpha,
				onFormatChange,
				onInput,
				onPreset
			}
			
		}
	})
</script>
<style lang="scss">
	@import './index';
</style>