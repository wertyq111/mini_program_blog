<template>
	<view class="classlist pageBg">
		<view class="loadinglayout" v-if="!classList.length && !noData">
			<uni-load-more status="loading" />
		</view>

		<view class="content">
			<navigator class="item" :url="'/pages/preview/preview?id=' + item.id" v-for="item in classList"
				:key="item.id">
				<image :src="item.smallPicUrl" mode="aspectFill"></image>
			</navigator>
		</view>

		<view class="loadinglayout" v-if="classList.length">
			<uni-load-more :status="noData ? 'noMore' : 'loading'" />
		</view>

		<!-- 底部安全区域 -->
		<view class="safe-area-inset-bottom"></view>
	</view>
</template>

<script setup>
	import { requestApi } from '@/api/apis.js'
	import { gotoHome } from '@/utils/common.js'
	const classList = ref([])
	const noData = ref(false)

	const queryParams = {
		page: 1,
		perPage: 12
	}

	// 加载完毕获取请求参数
	onLoad((e) => {
		let { id = null, name = null, type = null } = e
		if (type) queryParams.type = type
		if (!id && !type) gotoHome()
		if(id !== null) {
			queryParams.classId = id
		}
		
		getClassList()
		// 设置头部标题
		if (name) uni.setNavigationBarTitle({
			title: name
		})
	})

	// 离开页面清除缓存
	onUnload((e) => {
		uni.removeStorageSync('storageClassList')
	})

	// 触底触发事件
	onReachBottom(() => {
		if (noData.value) return
		queryParams.page++
		getClassList()
	})

	const getClassList = async () => {
		let target = queryParams.type ? "userWallList" : "wallList"
		
		if(queryParams.type) {
			let user = uni.getStorageSync('user')
			queryParams[queryParams.type] = user.member.id
		}
		
		let res = await requestApi(target, queryParams, queryParams.type);

		if (queryParams.perPage > res.length) noData.value = true

		classList.value = [...classList.value, ...res]
		uni.setStorageSync("storageClassList", classList.value)
		uni.stopPullDownRefresh()
	}

	// 下拉刷新
	onPullDownRefresh(() => {
		classList.value = []
		getClassList()
	})
</script>

<style lang="scss" scoped>
	.classlist {
		.content {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 5rpx;
			padding: 5rpx;

			.item {
				height: 440rpx;

				image {
					width: 100%;
					height: 100%;
					display: block;
				}
			}
		}
	}
</style>