<!-- 关于小程序 -->
<template>
	<view class="about">
		<go-to :is-back="true" />
		<canvas canvas-id="bubble" :style="'width:' + width + 'px;height:' + height + 'px'" class="like-fx"></canvas>
		<bubbles ref="refchild" canvasId="bubble" :width="width" :height="height"></bubbles>

		<view class="titleZ text-center align-center">
			<text class="text-bold">关于小程序</text>
			<view class="contentZ">
				<text class="text-xl">个人兴趣开发。主要用来学习，研究小程序及个人博客系统的扩展和新功能的使用。</text>
			</view>
		</view>

		<view class="titleZ text-center align-center margin-top-xl">
			<text class="text-bold">技术栈</text>
			<view class="contentZ margin-top-lg">
				<text class="text-xl text-bold">后端接口</text>
				<text class="text-xl">：laravel10 + php8.2 进行接口开发，除了账号登录相关的接口，大部分接口都需要登录后才能访问。</text>
			</view>
			<view class="contentZ" style="margin-top: 40rpx;">
				<text class="text-xl text-bold">后台管理系统</text>
				<text class="text-xl">：Vue2 进行开发，主要对小程序的数据进行管理。包括会员信息，壁纸，文章等。也有开发工具等功能陆续上线。</text>
			</view>
			<view class="contentZ" style="margin-top: 40rpx;">
				<text class="text-xl text-bold">小程序端</text>
				<text class="text-xl">：Uniapp + Vu3 进行开发， 根据自身的学习进度陆续开发各种功能。</text>
			</view>
		</view>

		<button class='' open-type="contact">
			<image src='https://www.chouy.xyz:4431/static/logo.png' class='share-img png round shadow-lg bg-white' mode='aspectFit'>
			</image>
		</button>
	</view>
</template>

<script setup>
	import {
		onShareAppMessage
	} from "@dcloudio/uni-app"
import { onUnmounted } from "vue";

	const animationTimer = ref(null)
	const width = ref(375)
	const height = ref(1920)
	const refchild = ref()

	onLoad(() => {
		startBubbleAnimation()
	})
	
	onUnmounted(() => {
		clearTimer()
	})

	onShareAppMessage((e) => {
		return {
			title: '快来和我们玩转软件开发吧～',
			path: '/pages/about/about?from=share'
		}
	})

    /* 启动冒泡动画 */
	const startBubbleAnimation = () => {
		animationTimer.value = setInterval(() => {
			refchild.value.likeClick()
		}, 300)

	}
	
	/* 清除定时器 */
	const clearTimer = () => {
		if (animationTimer.value) {
			clearTimeout(animationTimer.value)
		}
	}
</script>

<style lang="scss" scoped>
	.titleZ {
		width: 750rpx;
		font-size: 52rpx;
		margin-top: 60rpx;
	}

	.contentZ {
		width: 650rpx;
		margin: 10rpx auto 0;
		text-align: left;
	}

	.about-bg {
		background-size: cover;
		width: 100vw;
		height: 100vh;
		justify-content: center;
		flex-direction: column;
		color: #fff;
	}

	.edit-fixed {
		position: fixed;
		width: 100%;
		bottom: 0;
		z-index: 1024;
		box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.1);
	}

	.detail-imgs image {
		width: 100%;
		float: left;
		/* height:400rpx; 不定高了*/
		border: 0;
		padding: 0;
		margin: 0
	}

	.share-img {
		position: fixed;
		padding: 10rpx;
		width: 100rpx;
		height: 100rpx;
		/* top: 680rpx; */
		bottom: 200rpx;
		right: 20rpx;
		z-index: 1024;
		opacity: 0.8;
		box-shadow: 0rpx 8rpx 30rpx 0rpx rgba(0, 0, 0, 0.3);
		border: none;
	}

	.about {
		margin: 0;
		width: 100%;
		height: 100vh;
		padding-top: 20%;
		color: #fff;
		background: linear-gradient(-120deg, #F15BB5, #9A5CE5, #01BEFF, #00F5D4);
		/* background: linear-gradient(-120deg, #0976ea, #c471f5, #f956b6, #ea7e0a); */
		background-size: 500% 500%;
		animation: gradientBG 15s ease infinite;
	}

	@keyframes gradientBG {
		0% {
			background-position: 0% 50%;
		}

		50% {
			background-position: 100% 50%;
		}

		100% {
			background-position: 0% 50%;
		}
	}

	.container {
		width: 100%;
		position: absolute;
		text-align: center;
	}

	.like-fx {
		position: fixed;
		right: 0;
		z-index: 1024;
		pointer-events: none;
		/* background-color: red; */
	}
</style>