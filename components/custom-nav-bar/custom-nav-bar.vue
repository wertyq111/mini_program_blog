<template>
	<view class="layout">
		<view class="navbar">
			<view class="statusBar" :style="{height: getStatusBarHeight() + 'px'}"></view>
			<view class="titleBar" :style="{height: getTitleBarHeight() + 'px'}">
				<go-to v-if="isBack" :is-back="true"/>
				<view class="title">{{title}}</view>
				<view class="search" v-if="!isBack">
					<navigator url="/pages/search/search">
						<uni-icons class="icon" type="search" color="#888" size="18" />
						<text class="text">搜索</text>
					</navigator>
				</view>
			</view>
		</view>
		<view class="fill" :style="{height: getNavBarHeight() + 'px'}"></view>
	</view>
</template>

<script setup>
	import {
		getStatusBarHeight,
		getTitleBarHeight,
		getNavBarHeight
	} from '@/utils/system.js'

	defineProps({
		title: {
			type: String,
			default: "推荐"
		},
		isBack: {
			type: Boolean,
			default: false
		}
	})
</script>

<style lang="scss" scoped>
	.layout {
		.navbar {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 10;
			background:
				linear-gradient(to bottom, transparent, #fff 400rpx),
				linear-gradient(to right, #beecd8 20%, #f4e2d8);

			.statusBar {}

			.titleBar {
				display: flex;
				align-items: center;
				padding: 0 30rpx;

				.title {
					font-size: 22px;
					font-weight: 700;
					color: $text-font-color-1;
				}

				.search {
					width: 220rpx;
					height: 50rpx;
					border-radius: 60rpx;
					background: rgba(255, 255, 255, 0.4);
					border: 1px solid #fff;
					margin-left: 30rpx;
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
		}

		.fill {}
	}
</style>
