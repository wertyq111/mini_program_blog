<template>
	<view class="contaier">
		<view class="text-xxl" style="height: 770rpx; position: relative;">
			<image src='https://cdn.chouy.xyz/login/logo.png' mode='widthFix' class='png'
				style='width:100%;height:486rpx'></image>
			<go-to :is-back="true" backClass="login" />

			<view style="width: 100% ;position: absolute; top: 150rpx;">
				<view class="titleImg margin-tb-xs">
					<view class="titleZi">
						<text class="cuIcon-favor margin-right-sm"></text>
						照 / 片 / 墙
						<text class="cuIcon-favor margin-left-sm"></text>
					</view>
				</view>

				<view style="position: relative; background-image: url(https://cdn.chouy.xyz/static/wccswF.png);">
					<swiper class="card-swiper" :current='cardCur' :circular="true" vertical="true" :autoplay="false"
						duration="500" interval="5000" @change="cardSwiper">
						<swiper-item v-for="(item,index) in swiperList" :key="index"
							:class="cardCur == index ? 'cur' : ''" @click="previewImg(item.url)">
							<view class="swiper-item image-banner">
								<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
							</view>
						</swiper-item>
					</swiper>
					<view class="indication">
						<block v-for="(item,index) in swiperList" :key="index">
							<view @click="clickItem(index)" class="spot" :class="cardCur == index ? 'active': '' ">
								{{item.text}}
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-bar bg-white margin-top-xs solid-bottom">
			<common-title>
				<template #name><text class="text-xl text-bold text-shadow">最新照片</text></template>
				<template #abc><text class="text-ABC">NEWPHOTOS</text></template>
			</common-title>
		</view>
		<view class="cu-list menu-avatar">
			<view class="cu-item" @click="goTimeLine">
				<view class="cu-avatar radius lg" style="background-image:url(https://cdn.zhoukaiwen.com/aoshan.jpg);">
				</view>
				<view class="content">
					<view class="text-shadow text-black text-bold">鳌山滑雪场</view>
					<view class="text-gray text-sm flex">
						<text>更新3313张照片</text>
					</view>
				</view>
				<view class="action">
					<view class="text-grey text-xs">1天前</view>
				</view>
			</view>

			<view class="cu-item" @click="goTimeLine">
				<view class="cu-avatar radius lg" style="background-image:url(https://cdn.zhoukaiwen.com/fulong.png);">
				</view>
				<view class="content">
					<view class="text-shadow text-black text-bold">富龙滑雪场</view>
					<view class="text-gray text-sm flex">
						<text>更新1832张照片</text>
					</view>
				</view>
				<view class="action">
					<view class="text-grey text-xs">3天前</view>
				</view>
			</view>

			<view class="cu-item" @click="goTimeLine">
				<view class="cu-avatar radius lg" style="background-image:url(https://cdn.zhoukaiwen.com/aoshan.jpg);">
				</view>
				<view class="content">
					<view class="text-shadow text-black text-bold">可可托海滑雪场</view>
					<view class="text-gray text-sm flex">
						<text>更新823张照片</text>
					</view>
				</view>
				<view class="action">
					<view class="text-grey text-xs">1周前</view>
				</view>
			</view>

			<view class="cu-item" @click="goTimeLine">
				<view class="cu-avatar radius lg" style="background-image:url(https://cdn.zhoukaiwen.com/fulong.png);">
				</view>
				<view class="content">
					<view class="text-shadow text-black text-bold">将军山滑雪场</view>
					<view class="text-gray text-sm flex">
						<text>更新3313张照片</text>
					</view>
				</view>
				<view class="action">
					<view class="text-grey text-xs">1个月前</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	const cardCur = ref(0)
	const towerStart = ref(0)
	const direction = ref("")
	const swiperList = ref([{
		id: 0,
		type: 'image',
		text: '卡通制作人',
		url: 'https://cdn.zhoukaiwen.com/kt1.jpg'
	}, {
		id: 1,
		type: 'image',
		text: '小红书趣图',
		url: 'https://zhoukaiwen.com/img/qh/kt3.jpg',
	}, {
		id: 2,
		type: 'image',
		text: 'A顶合照',
		url: 'https://zhoukaiwen.com/img/qh/he1.jpg'
	}, {
		id: 3,
		type: 'image',
		text: '摄影师小杰',
		url: 'https://zhoukaiwen.com/img/qh/he2.jpg'
	}, {
		id: 3,
		type: 'image',
		text: '摄影叉烧饭',
		url: 'https://zhoukaiwen.com/img/qh/wxt1.jpg'
	}, {
		id: 3,
		type: 'image',
		text: '缆车抓拍',
		url: 'https://zhoukaiwen.com/img/qh/he3.jpg'
	}])
	
	onLoad(() => {
		towerSwiper()
	})

	const towerSwiper = () => {
		for (let i = 0; i < swiperList.value.length; i++) {
			swiperList.value[i].zIndex = parseInt(swiperList.value.length / 2) + 1 - Math.abs(i - parseInt(swiperList
				.value.length / 2))
			swiperList.value[i].mLeft = i - parseInt(swiperList.value.length / 2)
		}
	}

	const previewImg = (imgUrl) => {
		console.log(imgUrl);
		// 预览图片
		uni.previewImage({
			urls: [imgUrl],
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
				success: function(data) {
					// console.log('okokok');
				},
				fail: function(err) {
					// console.log('err');
				}
			}
		});
	}
	const cardSwiper = (e) => {
		cardCur.value = e.detail.current
	}
	const clickItem = (index) => {
		cardCur.value = index;
	}
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

	/* 自定义导航栏内容 end */
	/* 轮播文案在外 start*/
	.card-swiper {
		height: 500rpx !important;
		width: 520rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.card-swiper swiper-item {
		height: 650rpx;
		width: 100% !important;
		box-sizing: border-box;
		padding: 0rpx;
		border-radius: 20rpx;
		overflow: hidden;
		left: 20rpx !important;
	}

	.card-swiper swiper-item .swiper-item {
		width: 100% !important;
		display: block;
		height: 100%;
		border-radius: 0rpx;
		transform: scale(1);
		transition: all 0.2s ease-in 0s;
		overflow: hidden;
	}

	.card-swiper swiper-item.cur .swiper-item {
		transform: none;
		transition: all 0.2s ease-in 0s;
	}

	.image-banner {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-banner image {
		width: 100%;
		height: 100%;
	}

	/* 轮播指示点 start*/
	.indication {
		z-index: 9999;
		width: 100%;
		height: 36rpx;
		position: absolute;
		display: inline-block;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.spot {
		color: $brand-theme-color;
		background-color: #D3F8E2;
		opacity: 1;
		width: 170rpx;
		height: 70rpx;
		line-height: 75rpx;
		border-radius: 20rpx;
		margin: 18rpx -30rpx !important;
		left: 590rpx;
		right: 0;
		top: -520rpx;
		position: relative;
		text-align: center;
		font-size: 28rpx;
		font-weight: 600;
	}

	.spot.active {
		color: #FFFFFF;
		opacity: 1;
		background-image: linear-gradient(45deg, #28b389, #beecd8);
	}

	// 结束

	.image-piccapsule {
		background-size: cover;
		background-repeat: no-repeat;
		background-position: top;
		border-radius: 10px 10px 0 0;

		.image-capsule {
			padding: 55px 0px;
			font-size: 20px;
			font-weight: 300;
			position: relative;

			.photographer {
				position: absolute;
				color: #FFFFFF;
				left: 105rpx;
				top: 62rpx;
				font-size: 38rpx;
				letter-spacing: 4rpx;
				font-weight: 500;
				vertical-align: text-bottom;
				opacity: .85;
			}

			.photographerS1,
			.photographerS2 {
				position: absolute;
				color: #FFFFFF;
				font-size: 28rpx;
				opacity: .7;
				font-weight: 500;
			}

			.photographerS1 {
				left: 160rpx;
				bottom: 30rpx;
			}

			.photographerS2 {
				left: 300rpx;
				bottom: 30rpx;
			}
		}
	}


	// 横滑海报
	.kite-classify-scroll {
		width: 100%;
		padding: 10rpx;
		overflow: hidden;
		white-space: nowrap;
		background-color: #ffffff;
	}

	.kite-classify-cell {
		display: inline-block;
		width: 280rpx;
		background-color: #000000;
		border-radius: 10rpx;
		overflow: hidden;
		position: relative;
	}

	.demo-price {
		position: absolute;
		right: 20rpx;
		top: 20rpx;
		background: rgba(0, 0, 0, .5);
		padding: 8rpx 12rpx;
		border-radius: 10rpx;
		color: #EEEEEE;
		font-size: 22rpx;
	}

	.demo-title {
		width: 100%;
		font-size: 26rpx;
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		background: rgba(0, 0, 0, .5);
		padding: 12rpx;
		text-align: center;
		color: #EEEEEE;
		overflow: hidden;
		/*超出部分隐藏*/
		white-space: nowrap;
		/*不换行*/
		text-overflow: ellipsis;
		/*超出部分文字以...显示*/
	}

	.demo-tag {
		padding: 10rpx;
		display: flex;
		justify-content: space-around;
	}

	.demo-tag-owner {
		background-color: #fff;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 4rpx 14rpx;
		border-radius: 50rpx;
		font-size: 20rpx;
		line-height: 1;
	}

	.demo-tag-text {
		border: 1px solid #fff;
		color: #fff;
		margin-left: 10px;
		border-radius: 50rpx;
		line-height: 1;
		padding: 4rpx 14rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		font-size: 20rpx;
	}
</style>