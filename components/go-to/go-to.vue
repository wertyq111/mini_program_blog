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
	
	//const emits = defineEmits([ "doClose" ]);

	/* 返回上一页或者跳转到制定地址 */
	const goBack = () => {
		if(props.url) {
			uni.reLaunch({
				url: props.url
			})
		} else {
			uni.navigateBack()
		}
	}
	
	/* 调用父组件的关闭方法，用来处理返回跳转时当前页面正在执行的方法 */
	// const doClose = () => {
	// 	emit('doClose');
	// }
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
		position: fixed;
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
