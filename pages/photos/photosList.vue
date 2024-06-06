<template>
	<view class="photoslist pageBg">
		<view class="loadinglayout" v-if="!photosList.length">
			<uni-load-more status="loading" />
		</view>

		<view class="content">
			<navigator class="item" :url="'/pages/photos/preview?id=' + item.id" v-for="item in photosList" :key="item.id">
				<image class="item-image" :src="item.smallPicUrl" :fade="true" duration="450" mode="aspectFill"></image>
			</navigator>
		</view>
		
		<!-- 底部安全区域 -->
		<view class="safe-area-inset-bottom-custom"></view>
	</view>
</template>

<script setup>
	import {
		gotoHome
	} from '@/utils/common.js'
	const photosList = ref(uni.getStorageSync("storagePhotosList") ? uni.getStorageSync("storagePhotosList") : [])

	const props = defineProps({
		name: {
			type: String,
			default: ""
		}
	})

	// 加载完毕获取请求参数
	onLoad(() => {
		// 设置头部标题
		if (props.name) uni.setNavigationBarTitle({
			title: props.name
		})
	})

	// 离开页面清除缓存
	onUnload((e) => {
		uni.removeStorageSync('storagePhotosList')
	})
</script>

<style lang="scss">
	.photoslist {
		.content {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 5rpx;
			padding: 5rpx;

			.item {
				height: 440rpx;
								
				&-image {
					width: 100%;
					height: 100%;
					display: block;
				}
			}
		}
	}
</style>