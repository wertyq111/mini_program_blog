<template>
	<view class="text-xxl" style="position: relative;">
		<view class="login">
			<view class="top-bg top-center-bg" :style="'background-image: url(' + url + ');'">
				<image src='https://www.chouy.xyz:4431/static/login/wave-2.gif' mode='scaleToFill' class='gif-wave'></image>
			</view>
			<go-to :is-back="true" backClass="login" :searchShow="searchShow" :searchUrl="searchUrl" />
		</view>

		<view style="width: 100% ;position: absolute; top: 200rpx;">
			<view class="titleImg margin-tb-xs">
				<view class="titleZi">
					<text class="cuIcon-favor margin-right-sm"></text>
					{{ titleString }}
					<text class="cuIcon-favor margin-left-sm"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { getStatusBarHeight, getTitleBarHeight, getNavBarHeight } from '@/utils/system.js'
	const titleString = ref("")
	const props = defineProps({
		title: {
			type: String,
			default: ""
		},
		url: {
			type: String,
			default: "https://www.chouy.xyz:4431/static/login/logo.png"
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
	
	onMounted(() => {
		// 分割标题
		titleString.value = props.title.split("").join(" / ")
	})
</script>

<style lang="scss" scoped>
	.titleImg {
		position: relative;
		display: flex;
		height: 62px;
		font-size: 23px;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		background-size: cover;

		.titleZi {
			-webkit-background-clip: text;
			color: transparent;
			background-image: repeating-linear-gradient(45deg, #E74C3C, #9B59B6);
		}
	}
</style>