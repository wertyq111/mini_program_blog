<template>
	<view class="homelayout pageBg">
		<custom-nav-bar title="首页" />
		<view class="banner">
			<swiper indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" autoplay
				circular>
				<swiper-item v-for="item in bannerList" :key="item.id">
					<navigator v-if="item.target === 'miniProgram'" :url="item.url" class="link" target="miniProgram" :app-id="item.appid">
						<image :src="item.picurl" mode="aspectFill" />
					</navigator>
					<navigator v-else :url="`/pages/classlist/classlist?${item.url}`" class="link">
						<image :src="item.picurl" mode="aspectFill" />
					</navigator>
				</swiper-item>
			</swiper>
		</view>

		<view class="notice">
			<view class="left">
				<uni-icons type="sound-filled" size="20" />
				<text class="text">公告</text>
			</view>
			<view class="center">
				<swiper vertical autoplay :interval="1500" duration="300" circular>
					<swiper-item v-for="item in noticeList" :key="item.id">
						<navigator :url="'/pages/notice/detail?id=' + item.id">
							{{ item.title }}
						</navigator>
					</swiper-item>
				</swiper>
			</view>
			<view class="right">
				<uni-icons type="right" size="16" color="#333" />
			</view>
		</view>

		<view class="select">
			<common-title>
				<template #name><text class="text-xl text-bold text-shadow">每日推荐</text></template>
				<template #abc><text class="text-ABC">RECOMMEND</text></template>
				<template #custom>
					<view class="date">
						<uni-icons type="calendar" size="18" />
						<view class="text">
							<uni-dateformat :date="Date.now()" format="dd日"></uni-dateformat>
						</view>
					</view>
				</template>
			</common-title>
			<view class="content">
				<scroll-view scroll-x>
					<view class="box" v-for="item in randomList" :key="item.id" @click="goPreview(item.id)">
						<image :src="item.smallPicUrl" mode="aspectFill" />
					</view>
				</scroll-view>
			</view>
		</view>

		<view class="theme">
			<common-title>
				<template #name><text class="text-xl text-bold text-shadow">专题精选</text></template>
				<template #abc><text class="text-ABC">CHOSEN</text></template>
				<template #custom>
					<navigator open-type="reLaunch" url="/pages/classify/classify" class="more">更多</navigator>
				</template>
			</common-title>

			<view class="content">
				<theme-item v-for="item in classifyList" :key="item.id" :item="item" />
				<theme-item :isMore="true"></theme-item>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { requestApi } from '@/api/apis.js';
	import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app"

	const bannerList = ref([]);
	const noticeList = ref([]);
	const randomList = ref([]);
	const classifyList = ref([]);

	// 获取 Banner
	const getBanner = () => {
		bannerList.value = [{
			id: 1,
			sort: 1,
			target: "self",
			picurl: "https://cdn.chouy.xyz/wallpaper/banner/1712630556668676.jpg",
			url: "id=6&name=创意色彩"
		},{
			id: 2,
			sort: 2,
			target: "self",
			picurl: "https://cdn.chouy.xyz/wallpaper/banner/171263055687454.jpg",
			url: "id=1&name=可爱萌宠"
		},{
			id: 3,
			sort: 3,
			target: "miniProgram",
			picurl: "https://cdn.chouy.xyz/wallpaper/banner/1712630557083597.jpg",
			url: "/pages/index/index",
			appid: "wxbd89d0ba67f6b6a4"
		},{
			id: 4,
			sort: 4,
			target: "self",
			picurl: "https://cdn.chouy.xyz/wallpaper/banner/1712630557293549.jpg",
			url: "id=2&name=AI美图"
		}];
	}

	// 获取 公告
	const getNotice = async () => {
		let notebookList = await requestApi("notebookList", {include: "member"});
		if(notebookList) {
			notebookList.forEach(item => {
				noticeList.value.push({
					author: item.member.nickname,
					publish_date: item.createTime,
					select: true,
					title: item.title,
					view_count: item.viewCount,
					id: item.id
				})
			})
		}

		// noticeList.value = [{
		// 	author: "咸虾米",
		// 	publish_date: 1698041511788,
		// 	select: true,
		// 	title: "咸虾米壁纸，版权公告",
		// 	view_count: 8657,
		// 	id: "65360ea7bd0220d7635bd34b"
		// },{
		// 	author: "咸虾米",
		// 	publish_date: 1698045489090,
		// 	select: false,
		// 	title: "关于我们，相关介绍",
		// 	view_count: 854,
		// 	id: "65361e318b0da4ca084e3ce0"
		// },{
		// 	author: "咸虾米",
		// 	publish_date: 1698051468713,
		// 	select: false,
		// 	title: "常见问题，自行排查",
		// 	view_count: 6690,
		// 	id: "6536358ce0ec19c8d67fbe82"
		// },{
		// 	author: "咸虾米",
		// 	publish_date: 1697974214505,
		// 	select: true,
		// 	title: "欢迎关注咸虾米圈子公众号，获取UP主咸虾米最新动态。",
		// 	view_count: 19804,
		// 	id: "653507c6466d417a3718e94b"
		// }];
	}

	// 获取 随机 9 宫格图片
	const getDayRandom = async () => {
		randomList.value = await requestApi("randomWall");
	}

	// 获取专题图片
	const getClassify = async () => {
		classifyList.value = await requestApi("classify", {"select": true});
	}


	// 跳转到预览页面
	const goPreview = (id) => {
		uni.setStorageSync("storageClassList", randomList.value)
		uni.navigateTo({
			url: "/pages/preview/preview?id=" + id,
		})
	}

	// 分享朋友圈
	onShareTimeline(() => {
		return {
			title: "壁纸"
		}
	})

	// 分享给好友
	onShareAppMessage((e) => {
		return {
			title: "壁纸",
			path: "/pages/index/index"
		}
	})

	getBanner()
	getNotice()
	getDayRandom()
	getClassify()
</script>

<style lang="scss" scoped>
	.homelayout {
		.banner {
			width: 750rpx;
			padding: 30rpx 0;

			swiper {
				width: 100%;
				height: 340rpx;

				&-item {
					width: 100%;
					height: 100%;
					padding: 0 30rpx;
					.link {
						width: 100%;
						height: 100%;
						image {
							width: 100%;
							height: 100%;
							border-radius: 10rpx;
						}
					}
				}
			}
		}

		.notice {
			width: 690rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: #f9f9f9;
			margin: 0 auto;
			border-radius: 80rpx;
			display: flex;

			.left {
				width: 140rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				:deep() {
					.uni-icons {
						color: $brand-theme-color !important;
					}
				}
				.text {
					color: $brand-theme-color;
					font-weight: 600;
					font-size: 28rpx;
				}
			}

			.center {
				flex: 1;

				swiper {
					height: 100%;

					&-item {
						height: 100%;
						font-size: 30rpx;
						color: #666;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}

			.right {
				width: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.select {
			padding-top: 50rpx;
			.date {
				:deep() {
					.uni-icons {
						color: $brand-theme-color !important;
					}
				}
				color: $brand-theme-color;
				display: flex;
				align-items: center;

				.text {
					margin-left: 5rpx;
				}
			}

			.content {
				width: 720rpx;
				margin-left: 30rpx;
				margin-top: 30rpx;

				scroll-view {
					white-space: nowrap;

					.box {
						width: 200rpx;
						height: 430rpx;
						display: inline-block;
						margin-right: 15rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 10rpx;
						}
					}

					.box:last-child {
						margin-right: 30rpx;
					}
				}
			}
		}

		.theme {
			padding-top: 50rpx 0;
			.more {
				margin-right: 20rpx;
				font-size: 32rpx;
				color: #888;
			}
			.content {
				margin-top: 30rpx;
				padding: 0 30rpx;
				display: grid;
				gap: 15rpx;
				grid-template-columns: repeat(3, 1fr);
			}
		}
	}
</style>
