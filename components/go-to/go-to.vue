<template>
	<view :class="isBack ? 'arrow' : 'goBack'" :style="{top: getStatusBarHeight() + 'px'}" @click="goBack()">
		<uni-icons type="back" :color="isBack ? '#333' : '#fff'" size="20" />
	</view>
</template>

<script setup>
	import { getStatusBarHeight } from '@/utils/system.js';

	const props = defineProps({
		url: {
			type: String,
			default: ""
		},
		isBack: {
			type: Boolean,
			default: false
		}
	})

	// 返回上一页
	const goBack = () => {
		if(props.url) {
			uni.reLaunch({
				url: props.url
			})
		} else {
			uni.navigateBack()
		}
	}
</script>

<style lang="scss" scoped>
	.goBack {
		position:absolute;
		width: 38px;
		height: 38px;
		background: rgba(0, 0, 0, 0.5);
		left: 30rpx;
		margin-left: 0;
		border-radius: 100px;
		top: 0;
		backdrop-filter: blur(10rpx);
		border: 1rpx solid rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.arrow {
		width: 38px;
		height: 38px;
		left: 30rpx;
		margin-left: 0;
		border-radius: 100px;
		top: 0;
		backdrop-filter: blur(10rpx);
		border: 1rpx solid rgba(255, 255, 255, 0);
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
