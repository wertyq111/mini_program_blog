<template>
	<view class="preview" v-if="currentInfo">
		<swiper circular :current="currentIndex" @change="swiperChange">
			<swiper-item v-for="(item, index) in classList" :key="item.id">
				<image v-if="readImgs.includes(index)" @click="maskChange" :src="item.picurl" mode="aspectFill" />
			</swiper-item>
		</swiper>
		<view class="mask" v-if="maskStatus">
			<go-to :url="isShare ? '/pages/classify/classify' : ''"/>
			<view class="count">{{ currentIndex + 1 }} / {{ classList.length }}</view>
			<view class="time">
				<uni-dateformat :date="new Date()" format="hh:mm"></uni-dateformat>
			</view>
			<view class="date">
				<uni-dateformat :date="new Date()" format="MM月dd日"></uni-dateformat>
			</view>
			<view class="footer">
				<view class="box">
					<uni-icons type="info" size="28" @click="clickInfo" />
					<view class="text">信息</view>
				</view> 
				<view class="box" @click="clickScore">
					<uni-icons type="star" size="28" />
					<view class="text">{{ currentInfo.score }} 分</view>
				</view>
				<view class="box" @click="clickDownload">
					<uni-icons type="download" size="23" />
					<view class="text">下载</view>
				</view>
			</view>
		</view>

		<uni-popup ref="infoPopup" type="bottom">
			<view class="infoPopup">
				<view class="popHeader">
					<view></view>
					<view class="title">壁纸信息</view>
					<view class="close" @click="clickInfoClose">
						<uni-icons type="closeempty" size="18" color="#999" />
					</view>
				</view>
				<scroll-view scroll-y>
					<view class="content">
						<view class="row">
							<view class="label">壁纸ID：</view>
							<text class="value" user-select>{{ currentInfo.id }}</text>
						</view>
						<!-- <view class="row">
							<view class="label">分类：</view>
							<text class="value highlight">{{ currentInfo.name }}</text>
						</view> -->
						<view class="row">
							<view class="label">发布者：</view>
							<text class="value">{{ currentInfo.nickname }}</text>
						</view>

						<view class="row">
							<text class="label">评分：</text>
							<view class='value roteBox'>
								<uni-rate :value="currentInfo.score" readonly touchcancel />
								<text class="score"> {{ currentInfo.score }}分</text>
							</view>
						</view>

						<view class="row">
							<text class="label">摘要：</text>
							<view class='value'>
								{{ currentInfo.description }}
							</view>
						</view>

						<view class="row">
							<text class="label">标签：</text>
							<view class='value tabs'>
								<view class="tab" v-for="(tag, index) in currentInfo.tags" :key="index">{{ tag }}</view>
							</view>
						</view>

						<view class="copyright">
							声明：本图片来用户投稿，非商业使用，用于免费学习交流，如侵犯了您的权益，您可以拷贝壁纸ID举报至平台，邮箱wertyq222@163.com，管理将删除侵权壁纸，维护您的权益。
						</view>

						<view class="safe-area-inset-bottom"></view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>

		<uni-popup ref="scorePopup" :is-mask-click="false">
			<view class="scorePopup">
				<view class="popHeader">
					<view></view>
					<view class="title">{{ isScore ? '已经评分过了~' : '壁纸评分' }}</view>
					<view class="close" @click="clickScoreClose">
						<uni-icons type="closeempty" size="18" color="#999" />
					</view>
				</view>
				<view class="content">
					<uni-rate v-model="userScore" allowHalf :disabled="isScore" disabled-color="#ffca3e" />
					<text class="text">{{userScore}}分</text>
				</view>
				<view class="footer">
					<button :disabled="!userScore || isScore" @click="submitScore" type="default" size="mini"
						plain>确认评分</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import { requestApi } from '@/api/apis';
	const maskStatus = ref(true)
	const infoPopup = ref(null)
	const scorePopup = ref(null)
	const userScore = ref(0)
	const isScore = ref(false)
	const classList = ref([])
	const currentIndex = ref(0)
	const currentInfo = ref(null)
	const readImgs = ref([])
	const isShare = ref(false)


	// 获取缓存
	const storgClassList = uni.getStorageSync("storageClassList")
	// 复制数组，新增大图 url
	classList.value = storgClassList.map(item => {
		return {
			...item,
			picurl: item.smallPicUrl.replace("?imageMogr2/thumbnail/!30p", "")
		}
	})

	// 根据传参获取图片信息
	onLoad(async (e) => {
		let { id,type } = e	
		if(type == 'share') {
			isShare.value = true
			classList.value = await requestApi("detailWall", {id}, {}, true)
			classList.value = classList.value.map(item => {
				return {
					...item,
					picurl: item.smallPicUrl.replace("?imageMogr2/thumbnail/!30p", "")
				}
			})
		} else {
			currentIndex.value = classList.value.findIndex(item => item.id === parseInt(id))
		}
		
		currentInfo.value = classList.value[currentIndex.value]
		setReadImgs()
	})
	

	// 滑动图片事件
	const swiperChange = (e) => {
		currentIndex.value = e.detail.current
		currentInfo.value = classList.value[currentIndex.value]
		setReadImgs()

	}

	// 隐藏显示遮罩层
	const maskChange = () => {
		maskStatus.value = !maskStatus.value
	}


	// 弹出图片信息
	const clickInfo = () => {
		infoPopup.value.open()
	}

	// 关闭图片信息
	const clickInfoClose = () => {
		infoPopup.value.close()
	}

	// 评分弹窗
	const clickScore = () => {
		if (currentInfo.value.score) {
			userScore.value = currentInfo.value.score
			isScore.value = true
		}
		scorePopup.value.open()
	}

	// 关闭评分弹窗
	const clickScoreClose = () => {
		scorePopup.value.close()
		userScore.value = 0
		isScore.value = false
	}

	// 确认频分
	const submitScore = async () => {
		uni.showLoading({
			title: "加载中..."
		})
		let {classId,id} = currentInfo.value
		let params = {
			classId,
			id,
			score: userScore.value
		}
		let res = await requestApi("setupScore", params, {method: 'POST'}, true)
		uni.hideLoading()
		if ("id" in res) {
			uni.showToast({
				title: "评分成功",
				icon: "none"
			})
		}
		// 将评分放入缓存并更新
		classList.value[currentIndex.value].score = userScore.value
		uni.setStorageSync("storgClassList", classList.value)
		clickScoreClose()
	}

	// 下载图片
	const clickDownload = async () => {
		// #ifdef H5
		uni.showModal({
			content: "请长按保存壁纸",
			showCancel: false
		})
		// #endif

		// #ifndef H5
		try {
			uni.showLoading({
				title: "下载中..."
			})
			
			// 保存图片
			uni.getImageInfo({
				src: currentInfo.value.picurl,
				success: res => {
					uni.saveImageToPhotosAlbum({
						filePath: res.path,
						success: res => {
							uni.showToast({
								title: "保存成功!",
								icon: "none"
							})
							// 处理我的下载验证
							checkDownload()
						},
						fail: err => {
							if (err.errMsg === 'saveImageToPhotosAlbum:fail cancel') {
								uni.showToast({
									title: "图片保存失败，请重新点击下载!",
									icon: "none"
								})
								return;
							}
							uni.showModal({
								title: "授权提示",
								content: "需要授权保存相册",
								success: res => {
									if (res.confirm) {
										uni.openSetting({
											success: setting => {
												if (setting
													.authSetting[
														'scope.writePhotosAlbum'
														]) {
													uni.showToast({
														title: "获取授权成功",
														icon: "none"
													})
												} else {
													uni.showToast({
														title: "获取授权失败",
														icon: "none"
													})
												}
											}
										})
									}
								}
							})
						},
						complete: () => {
							uni.hideLoading()
						}
					})
				}
			})
		} catch (e) {
			console.log(e);
		} finally {
			uni.hideLoading()
		}
		// #endif
	}

	// 设置已读图片
	function setReadImgs() {
		readImgs.value.push(
			currentIndex.value === 0 ? classList.value.length - 1 : currentIndex.value - 1,
			currentIndex.value,
			currentIndex.value === classList.value.length - 1 ? 0 : currentIndex.value + 1
		)

		// 数组去重
		readImgs.value = [...new Set(readImgs.value)]
	}
	
	// 验证我的下载
	async function checkDownload() {
		try {
			let {id} = currentInfo.value
			let params = {id}
			await requestApi("downloadWall", params, {}, true)
			return true
		} catch (e) {
			throw e
		}
	}
	
	// 分享给好友
	onShareAppMessage((e) => {
		return {
			title: "壁纸预览",
			path: "/pages/preview/preview?id=" + currentInfo.value.id + "&type=share"
		}
	})
</script>

<style lang="scss" scoped>
	.preview {
		width: 100%;
		height: 100vh;
		position: relative;

		swiper {
			width: 100%;
			height: 100%;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.mask {
		&>view {
			width: fit-content;
			position: absolute;
			left: 0;
			right: 0;
			margin: auto;
			color: #fff;
		}

		.goBack {
			width: 38px;
			height: 38px;
			background: rgba(0, 0, 0, 0.5);
			left: 30rpx;
			margin-left: 0;
			border-radius: 100px;
			top: 0;
			backdrop-filter: blur(10rpx);
			border: 1rpx solid rgba(255, 255, 255, 0.3);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.count {
			top: 10vh;
			font-size: 28rpx;
			border-radius: 40rpx;
			padding: 8rpx 28rpx;
			backdrop-filter: blur(10rpx);
		}

		.time {
			font-size: 140rpx;
			top: calc(10vh + 80rpx);
			font-weight: 100;
			line-height: 1em;
			text-shadow: 0 4rpx rgba(0, 0, 0, 0.3);
		}

		.date {
			font-size: 34rpx;
			top: calc(10vh + 230rpx);
			text-shadow: 0 2rpx rgba(0, 0, 0, 0.3);
		}

		.footer {
			background: rgba(255, 255, 255, 0.8);
			bottom: 10vh;
			width: 65vw;
			height: 120rpx;
			border-radius: 60rpx;
			color: #000;
			display: flex;
			justify-content: space-around; // 平均分配
			align-items: center;
			box-shadow: 0 2rpx 0 rgba(0, 0, 0, 0.1);
			backdrop-filter: blur(20rpx);

			.box {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 2rpx 12rpx;

				.text {
					font-size: 26rpx;
					color: $text-font-color-2;
				}
			}
		}
	}

	.infoPopup {
		background: #fff;
		padding: 30rpx;
		border-radius: 30rpx 30rpx 0 0;
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

		scroll-view {
			max-height: 60vh;

			.content {
				.row {
					display: flex;
					padding: 16rpx 0;
					font-size: 32rpx;
					line-height: 1.7em;

					.label {
						color: $text-font-color-3;
						width: 140rpx;
						text-align: right;
						font-size: 30rpx;
					}

					.value {
						flex: 1;
						width: 0;
					}

					.roteBox {
						display: flex;
						align-items: center;

						.score {
							font-size: 26rpx;
							color: $text-font-color-2;
							padding-left: 10rpx;
						}
					}

					.tabs {
						display: flex;
						flex-wrap: wrap;

						.tab {
							border: 1px solid $brand-theme-color;
							color: $brand-theme-color;
							font-size: 22rpx;
							padding: 10rpx 30rpx;
							border-radius: 40rpx;
							line-height: 1em;
							margin: 0 10rpx 10rpx 0;
						}
					}

					.highlight {
						color: $brand-theme-color;
					}
				}

				.copyright {
					font-size: 28rpx;
					padding: 20rpx;
					background: #F6F6F6;
					color: $text-font-color-3;
					border-radius: 10rpx;
					margin: 20rpx 0;
					line-height: 1.6em;
				}
			}
		}
	}

	.scorePopup {
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
		}

		.footer {
			padding: 10rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>