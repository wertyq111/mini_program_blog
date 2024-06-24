<template>
	<view>
		<demo-block title="方形">
			<l-color-picker :presets="presets" @change="change" @formatChange="formatChange"></l-color-picker>
			<view v-if="colors.hex" style="padding-top: 30rpx;">
				<text>当前选择的颜色为：</text>
				<view class="flex">
					<view class="preview" :style="'background-color:' + colors.rgb"></view>
					<view>
						<view>{{colors?.hex}}</view>
						<view>{{colors?.rgb}}</view>
						<view>{{colors?.hsb}}</view>
					</view>
				</view>
			</view>
		</demo-block>
	</view>
</template>
<script>
	import {defineComponent, ref} from 'vue';
	export default defineComponent({
		setup() {
			const presets = [{
					label: 'Recommended',
					colors: [
						'#000000',
						'#000000E0',
						'#000000A6',
						'#00000073',
						'#00000040',
						'#00000026',
						'#0000001A',
						'#00000012',
						'#0000000A',
						'#00000005',
						'#F5222D',
						'#FA8C16',
						'#FADB14',
						'#8BBB11',
						'#52C41A',
						'#13A8A8',
						'#1677FF',
						'#2F54EB',
						'#722ED1',
						'#EB2F96',
						'#F5222D4D',
						'#FA8C164D',
						'#FADB144D',
						'#8BBB114D',
						'#52C41A4D',
						'#13A8A84D',
						'#1677FF4D',
						'#2F54EB4D',
						'#722ED14D',
						'#EB2F964D',
					],
				},
				{
					label: 'Recent',
					colors: [],
				},
			]
			const colors = ref({
				hex: '',
				rgb: '',
				hsb: '',
			})
			const color = ref('#fa8c16')
			const change = (value) => {
				colors.value = {
					hex: value.toHexString(),
					rgb: value.toRgbString(),
					hsb: value.toHsbString(),
				}
			}
			const formatChange = (format) => {
				console.log('当前颜色格式::', format)
			}
			return {
				presets,
				change,
				formatChange,
				colors,
				color
			}
		}
	})
</script>
<style lang="scss">
	.flex {
		margin-top: 20rpx;
		display: flex;
		align-items: stretch;
	}

	.preview {
		width: 200rpx;
		margin-right: 30rpx;
	}
</style>