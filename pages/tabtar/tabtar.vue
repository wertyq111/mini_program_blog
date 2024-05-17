<template>
	<view>
		<index v-if="pageCur=='index'"></index>
		<classify v-if="pageCur=='classify'"></classify>
		<aggregate v-if="pageCur=='aggregate'"></aggregate>
		<notebook v-if="pageCur=='notebook'"></notebook>
		<user v-if="pageCur=='user'"></user>

		<view class="box">
			<view class="cu-bar tabbar bg-white shadow foot">
				<view class="action" @click="navChange" data-cur="index">
					<view class='cuIcon-cu-image'>
						<image v-if="pageCur=='index'" src="../../static/images/tabBar/home-h.png"></image>
						<image v-if="pageCur != 'index'" src=".../../static/images/tabBar/home.png"></image>
					</view>
					<view :class="pageCur=='index'?'color_main':'text-gray'">首页推荐</view>
				</view>

				<view class="action" @click="navChange" data-cur="classify">
					<view class='cuIcon-cu-image'>
						<!-- <view class="cu-tag badge">红点</view> -->
						<image v-if="pageCur=='classify'" src="../../static/images/tabBar/classify-h.png"></image>
						<image v-if="pageCur != 'classify'" src="../../static/images/tabBar/classify.png"></image>
					</view>
					<view :class="pageCur=='classify'?'color_main':'text-gray'">壁纸分类</view>
				</view>

				<view @click="navChange" class="action text-gray add-action" data-cur="aggregate">
					<image class="logo_btn" mode="widthFix" src="../../static/images/tabBar/center.png"></image>
					<view :class="pageCur=='aggregate'?'color_main':'text-gray'">大集合</view>
				</view>

				<view class="action" @click="navChange" data-cur="notebook">
					<view class='cuIcon-cu-image'>
						<!-- <view class="cu-tag badge">{{message}}</view> -->
						<image v-if="pageCur=='notebook'" src="../../static/images/tabBar/notebook-h.png"></image>
						<image v-if="pageCur != 'notebook'" src="../../static/images/tabBar/notebook.png"></image>
					</view>
					<view :class="pageCur=='notebook'?'color_main':'text-gray'">文章资讯</view>
				</view>

				<view class="action" @click="navChange" data-cur="user">
					<view class='cuIcon-cu-image'>
						<image v-if="pageCur=='user'" src="../../static/images/tabBar/user-h.png"></image>
						<image v-if="pageCur != 'user'" src="../../static/images/tabBar/user.png"></image>
					</view>
					<view :class="pageCur=='user'?'color_main':'text-gray'">个人中心</view>
				</view>

			</view>
		</view>

	</view>
</template>


<script setup>
	import index from '@/pages/index/index' // 首页推荐
	import classify from '@/pages/classify/classify' // 分类列表
	import aggregate from '@/pages/aggregate/aggregate' // 大集合
	import notebook from '@/pages/notebook/notebook' // 文章资讯
	import user from '@/pages/user/user' // 个人中心

	const pageCur = ref('index')
	const message = ref('0')
	const tip = ref('我是提示')
	const duration = ref(1)

	const navChange = e => {
		console.log(e.currentTarget.dataset.cur)

		pageCur.value = e.currentTarget.dataset.cur;
	}
</script>

<style lang="scss" scoped>
	.logo_btn {
		width: 38*2rpx;
		height: 38*2rpx;
		position: absolute;
		z-index: 2;
		border-radius: 50%;
		top: -40rpx;
		left: 0rpx;
		right: 0;
		margin: auto;
		padding: 0;
	}
</style>