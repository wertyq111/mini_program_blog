<template>
	<view class="noticeLayout">
		<view class="title">
			<view class="tag">
				<uni-tag text="置顶" inverted type="warning" v-if="detail.select" />
			</view>
			<view class="font">{{detail.title}}</view>
		</view>

		<view class="info">
			<view class="item">{{detail.author}}</view>
			<view class="item">
				<uni-dateformat :date="detail.publish_date" format="yyyy-MM-dd hh:mm:ss" />
			</view>
		</view>

		<view class="content">
			<mp-html :content="detail.content" />
		</view>

		<view class="count">
			阅读量: {{detail.view_count}}
		</view>
	</view>
</template>

<script setup>
	import {requestApi} from "@/api/apis.js"
    import { ref } from "vue"
	import {onLoad} from "@dcloudio/uni-app"
	
	const detail = ref({})
	let id = ""
	
	onLoad((e) => {
		id = e.id
		getDetail()
		if(e.name) {
			uni.setNavigationBarTitle({
				title: e.name
			})
		}
	})
	
	const getDetail = async () => {
		let res = await requestApi("wallNewsDetail", {id: id})
		detail.value = res
	}
	
	
</script>

<style lang="scss" scoped>
	.noticeLayout {
		padding: 30rpx;

		.title {
			font-size: 40rpx;
			color: #111;
			line-height: 1.6em;
			padding-bottom: 30rpx;
			display: flex;

			.tag {
				transform: scale(0.8);
				transform-origin: left center;
				flex-shrink: 0;
			}

			.font {
				padding-left: 6rpx;
			}
		}

		.info {
			display: flex;
			align-items: center;
			color: #999;
			font-size: 28rpx;

			.item {
				padding-right: 20rpx;
			}
		}

		.content {
			padding: 50rpx 0;
		}

		.count {
			color: #999;
			font-size: 28rpx;
		}
	}
</style>