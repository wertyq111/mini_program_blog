<template>
	<custom-nav-bar title="文章内容" :isBack="true"/>
	<view class="noticeLayout pageBg">
		<view class="title">
			<view class="tag">
				<uni-tag text="置顶" inverted type="warning" v-if="detail.select" />
			</view>
			<view class="font">{{detail.title}}</view>
		</view>

		<view class="info">
			<view class="item">{{detail.author}}</view>
			<view class="item">
				<uni-dateformat :date="detail.createTimestamp * 1000" format="yyyy-MM-dd hh:mm:ss" />
			</view>
		</view>

		<view class="content">
			<mp-html :content="detail.content" />
		</view>

		<view class="text-right text-df text-gray margin-top-sm margin-bottom-sm">
			<view style="display: inline-flex;align-items:center;">
				<uni-icons type="eye-filled" size="20" class="text-gray text-df" style="margin-right: 6rpx"></uni-icons>
				<text class="text-df margin-right-sm" style="margin-top: 2rpx;">{{detail.viewCount}}</text>
				<uni-icons type="hand-up-filled" size="20" class="text-gray text-df" :class="isGood ? 'is-good' : ''" style="margin-right: 6rpx" @click="good"></uni-icons>
				<text class="text-df margin-right-sm" style="margin-top: 2rpx;">{{detail.likeCount}}</text>
			</view>

		</view>
	</view>
</template>

<script setup>
	import { requestApi } from "@/api/apis.js"

	const detail = ref({})
	const isGood = ref(false)
	let id = ""

	onLoad((e) => {
		id = e.id
		getDetail()
		if (e.name) {
			uni.setNavigationBarTitle({
				title: e.name
			})
		}
	})

	/* 获取文章内容 */
	const getDetail = async () => {
		let res = await requestApi("notebookDetail", {
			id: id
		}, {}, true)
		detail.value = res
		// 如果当前账号已经点过赞就改变样式
		if(res.goods.length > 0) {
			let user = uni.getStorageSync('user')
			res.goods.forEach(item => {
				if(item.id === user.member.id) {
					isGood.value = true
				}
			})
		}
	}

	/* 点赞 */
	const good = () => {
		requestApi('notebookGood', {id: id}, {method: 'post'}, true).then(res => {
			isGood.value = true
			detail.value = res
		})
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

		.is-good {
			:deep() {
				.uni-icons {
					color: $brand-theme-color !important;
				}
			}
		}
	}
</style>
