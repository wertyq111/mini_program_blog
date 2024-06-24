<template>
	<movable-area 
		class="l-color-picker-slider" 
		:class="classes" 
		:style="styles">
		<view class="l-color-picker-slider-gradient" v-if="props.activeColor"></view>
		<movable-view 
			:x="x"
			class="l-color-picker-slider-handler" 
			direction="horizontal"
			:style="handlerStyles"
			:animation="false"
			:disabled="props.disabled"
			@change="change"
			>
		</movable-view>
	</movable-area>
</template>

<script lang="ts">
	import {  defineComponent, computed, onMounted, getCurrentInstance , reactive, watch, onUnmounted, PropType} from 'vue';
	import { addUnit } from '@/uni_modules/lime-shared/addUnit';
	import { unitConvert } from '@/uni_modules/lime-shared/unitConvert';
	import { getRect } from '@/uni_modules/lime-shared/getRect';
	import { throttle } from '@/uni_modules/lime-shared/throttle';
	import { useState } from '../l-color-picker/useState';
	const name = 'l-color-picker-slider';
	export default defineComponent({
		name,
		props: {
			type: {
				type: String as PropType<'hue'|'alpha'>,
				default: 'hue' // 'alpha'
			},
			disabled: Boolean,
			activeColor: String,
			blockSize: {
				type: [String, Number],
				default: 12
			},
			min: {
				type: Number,
				default: 0,
			},
			max: {
				type: Number,
				default: 100,
			},
			step: {
				type: Number,
				default: 1,
			},
			value: {
				type: Number,
				default: 0,
			}
		},
		emits: ['change'],
		setup(props, {emit}) {
			const context = getCurrentInstance();
			const store = reactive({
				sliderSize: 0
			})
			const classes = computed(() => ({
				[name + '--' + props.type]: props.type
			}))
			const dotSize = computed(() => addUnit(props.blockSize))
			const styles = computed(() => `height: ${dotSize.value}; --l-active-color: ${props.activeColor}`)
			const handlerStyles = computed(() => `height: ${dotSize.value}; width: ${dotSize.value}`)
			const scope = computed(() => props.max - props.min)
			const [isInput, changeState] = useState()
			const change = (e: any) => {
				if(isInput.value) return
				const {min, step} = props
				const value = Math.round((e.detail.x / store.sliderSize * scope.value + min) / step) * step;
				emit('change', value)
			}
			const x = computed(() => {
				const {min, max } = props
				const value = Math.max(Math.min(props.value, max), min)
				return (value - min) / scope.value * store.sliderSize
			})
		
			const stopWatch = watch(() => props.value, () => {
				changeState()
			})
			const getSliderSize = throttle(() => {
				getRect(`.${name}`, {context}).then(slider => {
					store.sliderSize = Number((slider['width'] - unitConvert(props.blockSize)).toFixed(2))
				})
			},3000)
			
			onUnmounted(() => {
				stopWatch()
			})
			onMounted(getSliderSize)
			return {
				props,
				classes,
				styles,
				handlerStyles,
				change,
				x
			}
		}
	})
</script>

<style lang="scss">
	.l-color-picker-slider {
		width: 100%;
		box-shadow: inset 0 0 1px 0 rgba(0, 0, 0, 0.25);
		border-radius: 10px;

		&--hue {
			background: linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0));
		}

		&--alpha {
			background-image: conic-gradient(#EEE 0 25%, transparent 0 50%, #EEE 0 75%, transparent 0);
			background-size: 8px 8px;
		}

		&-gradient {
			border-radius: 10px;
			position: absolute;
			inset: 0px;
			background: linear-gradient(to right, rgba(255, 0, 4, 0), var(--l-active-color));
		}

		&-handler {
			box-shadow: 0 0 0 3px #fff;
			border-radius: 50%;
		}
	}
</style>