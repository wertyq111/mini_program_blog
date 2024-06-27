<template>
	<view class="content">
		<view class="goBack" :style="Object.assign({}, customStyle[backClass], {top: getStatusBarHeight() + 'px'})"
			@click="goBack()">
			<uni-icons :style="{position: 'absolute', left: '15rpx', top: '12rpx'}" type="back" :color="isBack ? '#333' : '#fff'" size="20" />
		</view>
		<navigator v-if="searchShow" :url="searchUrl">
			<view class="search" :style="Object.assign({}, customStyle[backClass], {top: getStatusBarHeight() + 'px'})">
				<uni-icons class="icon" type="search" color="#888" size="18" />
				<text class="text">搜索</text>
			</view>
		</navigator>
	</view>

</template>

<script setup>
	import { onMounted } from 'vue';
	import { getStatusBarHeight } from '@/utils/system.js';

	const props = defineProps({
		url: {
			type: String,
			default: ""
		},
		isBack: {
			type: Boolean,
			default: false
		},
		backClass: {
			type: String,
			default: "preview"
		},
		searchShow: {
			type: Boolean,
			default: false
		},
		searchUrl: {
			type: String,
			default: "/pages/search/search"
		}
	})

	//const emits = defineEmits([ "doClose" ]);

	const customStyle = ref({
		'preview': {
			position: "absolute",
			background: "rgba(0, 0, 0, 0.5)"
		},
		'detail': {
			border: "1rpx"
		},
		'login': {
			position: "absolute",
			border: "1rpx"
		}
	})

	/* 返回上一页或者跳转到制定地址 */
	const goBack = () => {
		if (props.url) {
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
	.content {
		display: flex;
		align-items: center;
		justify-content: center;

		/* 返回图标基本样式 */
		.goBack {
			width: 38px;
			height: 38px;
			left: 30rpx;
			margin-left: 0;
			border-radius: 100px;
			top: 0;
			backdrop-filter: blur(10rpx);
			border: 1rpx solid rgba(255, 255, 255, 0.3);
		}

		.search {
			position: absolute;
			width: 220rpx;
			height: 50rpx;
			border-radius: 60rpx;
			background: rgba(255, 255, 255, 0.4);
			border: 1px solid #fff;
			margin-left: -280rpx;
			margin-top: 20rpx;
			color: #999;
			font-size: 28rpx;
			display: flex;
			align-items: center;

			.icon {
				margin-left: 5rpx;
			}

			.text {
				padding-left: 10rpx;
			}
		}
	}
</style>