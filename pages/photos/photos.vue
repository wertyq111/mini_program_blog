<template>
	<view class="contaier">
		<view class="text-xxl" style="height: 770rpx; position: relative;">
			<view class="login">
				<view class="top-bg top-center-bg"
					:style="'background-image: url(https://cdn.chouy.xyz/login/logo.png);'">
					<image src='https://cdn.chouy.xyz/login/wave-2.gif' mode='scaleToFill' class='gif-wave'></image>
				</view>
				<go-to :is-back="true" backClass="login" />
			</view>


			<view style="width: 100% ;position: absolute; top: 150rpx;">
				<view class="titleImg margin-tb-xs">
					<view class="titleZi">
						<text class="cuIcon-favor margin-right-sm"></text>
						照 / 片 / 墙
						<text class="cuIcon-favor margin-left-sm"></text>
					</view>
				</view>

				<view v-if="swiperList"
					style="position: relative; background-image: url(https://cdn.chouy.xyz/static/wccswF.png); z-index:999">
					<swiper v-if="swiperList.length" class="card-swiper" :current='cardCur' :circular="true"
						vertical="true" :autoplay="false" duration="500" interval="5000" @change="cardSwiper">
						<swiper-item v-for="(item,index) in swiperList" :key="index"
							:class="cardCur == index ? 'cur' : ''" @click="previewImg(item.url)">
							<view class="swiper-item image-banner">
								<up-image :src="item.url" width="100%" height="500rpx" mode="scaleToFill">
									<template #error>
										<view style="font-size: 24rpx;">加载失败</view>
									</template>
								</up-image>
							</view>
						</swiper-item>
					</swiper>
					<view class="indication" v-if="swiperList && swiperList.length">
						<block v-for="(item,index) in swiperList" :key="index">
							<view @click="clickItem(index)" class="spot" :class="cardCur == index ? 'active': '' ">
								{{item.remark ? item.remark : item.category ? item.category.name : "" }}
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>


		<common-title>
			<template #name><text class="text-xl text-bold text-shadow">相册集</text></template>
			<template #abc><text class="text-ABC">ALBUMS</text></template>
			<template #custom>
				<view class="plus" @click="isAddAlbum = true"><up-icon name="plus" /> 创建相册</view>
			</template>
		</common-title>
		<view v-if="albumList && albumList.length" class="cu-list menu-avatar">
			<view v-for="item in albumList" :key="item.id" class="cu-item" @click="goTimeLine(item.id)">
				<view class="cu-avatar radius lg"
					:style="'background-image:url(' + (item.photo ? item.photo.url : '') + ');'">
				</view>
				<view class="content">
					<view class="text-shadow text-black text-bold">{{item.name}}</view>
					<view class="text-gray text-sm flex">
						<text>共{{item.photos.length}}张照片</text>
					</view>
				</view>
				<view class="action">
					<view class="text-grey text-xs">{{compareTimestamp(item.updateTimestamp)}}前</view>
				</view>
			</view>
		</view>
		<up-popup :show="isAddAlbum" mode="center">
			<view class="albumPopup">
				<view class="popHeader">
					<view></view>
					<view class="title">创建相册</view>
					<view class="close" @click="closeAlbumPopup">
						<uni-icons type="closeempty" size="18" color="#999" />
					</view>
				</view>
				<view class="content">
					<up-form :model="albumForm" :rules="albumFormRules" ref="uFormRef" style="width: 100%;">
						<view class="cu-form-group margin-top solid-bottom">
							<up-form-item labelWidth="60" style="width: 100%;" label="相册名" prop="name">
								<up-input v-model="albumForm.name" placeholder="请输入相册名" border="surround" clearable />
							</up-form-item>
						</view>
						<view class="cu-form-group">
							<up-form-item labelWidth="60" style="width: 100%;" label="排序" prop="sort">
								<up-input v-model="albumForm.sort" type="number" border="surround" clearable />
							</up-form-item>
						</view>
					</up-form>
				</view>
				<view class="foot">
					<view class="padding margin-top-xs">
						<up-button color="linear-gradient(45deg, #28b389, #beecd8)" shape="circle" @click="createAlbum">创建</up-button>
					</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup>
	import {
		requestApi
	} from '@/api/apis';
	import {
		compareTimestamp
	} from '@/utils/common.js'

	const cardCur = ref(0)
	const towerStart = ref(0)
	const direction = ref("")
	const swiperList = ref([])
	const albumList = ref([])
	// 表单引用
	const uFormRef = ref(null);
	const albumForm = ref({
		name: "",
		sort: 125,
	})
	const isAddAlbum = ref(false)
	/* 校验规则 */
	const albumFormRules = {
		name: [{
			required: true,
			message: "请输入相册名",
			trigger: ["blur", "change"]
		}, {
			asyncValidator: (rule, value, callback) => {
				// 查询是否存在相同名称相册
				requestApi('checkAlbum', {
					name: value
				}).then(res => {
					if(typeof(res) == 'undefined') {
						callback();
					} else {
						callback(new Error('已存在同名相册'));
					}
				})
			},
			// 触发器可以同时用blur和change
			trigger: ['blur'],
		}],
		sort: {
			required: true,
			type: 'number',
			message: "排序值必须为数字",
			trigger: ["blur", "change"]
		}
	}

	onLoad(() => {
		towerSwiper()
		newAlbum()
	})

	/* 生成精选照片 */
	const towerSwiper = async () => {
		let photos = await requestApi('refinePhotos')
		if(photos) {
			for (let i = 0; i < photos.length; i++) {
				photos[i].zIndex = parseInt(photos.length / 2) + 1 - Math.abs(i - parseInt(photos.length / 2))
				photos[i].mLeft = i - parseInt(photos.length / 2)
			}
		}

		swiperList.value = photos
	}

	/* 获取最新相册 */
	const newAlbum = async () => {
		let albums = await requestApi('newAlbum')
		albumList.value = albums
	}

	/* 预览照片 */
	const previewImg = (imgUrl) => {
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

	/* 切换照片 */
	const cardSwiper = (e) => {
		cardCur.value = e.detail.current
	}

	/* 点击照片名 */
	const clickItem = (index) => {
		cardCur.value = index;
	}

	/* 相册跳转 */
	const goTimeLine = (albumId) => {
		uni.navigateTo({
			url: './timeLine?id=' + albumId
		})
	}
	
	/* 创建相册 */
	const createAlbum = () => {
		uFormRef.value.validate().then(async valid => {
			if (valid) {
				await requestApi("addAlbum", albumForm.value, {
					method: 'POST'
				}).then(async res => {
					uni.showToast({
						title: '创建成功！',
						icon: 'none'
					});
					
					// 刷新相册集
					newAlbum()
				})
			}
		}).finally(() => {
			isAddAlbum.value = false
		});
	}
	
	/* 关闭创建相册弹窗 */
	const closeAlbumPopup = () => {
		isAddAlbum.value = false
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

	.plus {
		display: flex;
		margin-right: 20rpx;
		font-size: 32rpx;
		color: #888;
	}

	.albumPopup {
		background: #fff;
		padding: 30rpx;
		width: 70vw;
		border-radius: 30rpx;
		overflow: hidden;

		.popHeader {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				color: $text-font-color-2;
				font-size: 26rpx;
			}

			.close {
				padding: 6rpx;
			}
		}

		.content {
			display: flex;
			padding: 30rpx 0;
			justify-content: center;
			align-items: center;

			.text {
				padding-left: 10rpx;
				color: #ffca3e;
				width: 80rpx;
				line-height: 1em;
				text-align: right;
			}

			.row {
				display: flex;
				padding: 16rpx 0;
				font-size: 32rpx;
				line-height: 1.7em;
				align-items: center;
				min-height: 100upx;
				justify-content: space-between;
			}
		}

		.footer {
			padding: 10rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>