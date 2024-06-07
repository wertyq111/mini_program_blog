<template>
	<view class="preview" v-if="currentInfo">
		<swiper circular :current="currentIndex" @change="swiperChange">
			<swiper-item v-for="(item, index) in photosList" :key="item.id">
					<movable-area v-if="readImgs.includes(index)" class="movable-area" scale-area>
						<movable-view class="movable-view" direction="all" :scale="true" scale-min="1">
							<image @click="maskChange" :src="item.picUrl"  mode="aspectFit" />
						</movable-view>
					</movable-area>
			</swiper-item> 
		</swiper>
		<view class="mask" v-if="maskStatus">
			<go-to :url="isShare ? '/pages/classify/classify' : ''" />
			<view class="count">{{ currentIndex + 1 }} / {{ photosList.length }}</view>
			<view class="time">
				<uni-dateformat :date="new Date()" format="hh:mm"></uni-dateformat>
			</view>
			<view class="date">
				<uni-dateformat :date="new Date()" format="MM月dd日"></uni-dateformat>
			</view>
			<view class="footer">
				<view class="box" @click="clickRefine">
					<uni-icons type="star" size="28" />
					<view class="text">精选</view>
				</view>
				<view class="box" @click="clickDownload">
					<uni-icons type="download" size="23" />
					<view class="text">下载</view>
				</view>
			</view>
		</view>

		<uni-popup ref="refinePopup" :is-mask-click="false">
			<view class="refinePopup">
				<view class="popHeader">
					<view></view>
					<view class="title">设为精选</view>
					<view class="close" @click="clickRefineClose">
						<uni-icons type="closeempty" size="18" color="#999" />
					</view>
				</view>
				<view class="content">
					<up-form ref="uFormRef" style="width: 100%;">
						<view class="row">
							<up-form-item labelWidth="80" style="width: 100%;" label="精选标题" prop="remark">
								<up-input v-model="remark" placeholder="请输入精选标题" border="none"></up-input>
							</up-form-item>
						</view>
						<view class="row">
							<up-form-item labelWidth="80" style="width: 100%;" label="设为精选">
								<up-switch v-model="show" />
							</up-form-item>
						</view>
					</up-form>
				</view>
				<view class="footer">
					<up-button color="linear-gradient(45deg, #28b389, #beecd8)" shape="circle" :customStyle="{width: '50%'}" @click="submitRefine">提交</up-button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		requestApi
	} from '@/api/apis';
	const maskStatus = ref(true)
	const infoPopup = ref(null)
	const refinePopup = ref(null)
	const photosList = ref([])
	const currentIndex = ref(0)
	const currentInfo = ref(null)
	const readImgs = ref([])
	const isShare = ref(false)
	const remark = ref("")
	const show = ref(false)

	// 根据传参获取图片信息
	onLoad(async (e) => {
		let {
			id,
			type
		} = e
		if (type == 'share') {
			isShare.value = true
			photosList.value = await requestApi("editPhoto", {
				id
			}, {}, true)
		} else {
			// 获取缓存
			photosList.value = uni.getStorageSync("storagePhotosList")
			currentIndex.value = photosList.value.findIndex(item => item.id === parseInt(id))
		}

		currentInfo.value = photosList.value[currentIndex.value]
		setReadImgs()
	})

	// 滑动图片事件
	const swiperChange = (e) => {
		currentIndex.value = e.detail.current
		currentInfo.value = photosList.value[currentIndex.value]
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

	// 精选弹窗
	const clickRefine = () => {
		show.value = currentInfo.value.show ? true : false
		remark.value = currentInfo.value.remark

		refinePopup.value.open()
	}

	// 关闭精选弹窗
	const clickRefineClose = () => {
		refinePopup.value.close()
	}

	// 确认频分
	const submitRefine = async () => {
		if (show.value && !remark.value) {
			uni.showToast({
				title: "请编辑精选标题",
				icon: "none"
			})
			return
		}
		uni.showLoading({
			title: "加载中..."
		})
		let {
			id
		} = currentInfo.value
		let params = {
			id,
			remark: remark.value,
			show: show.value
		}
		let res = await requestApi("editPhoto", params, {
			method: 'POST'
		}, true)
		uni.hideLoading()
		if ("id" in res) {
			uni.showToast({
				title: "精选成功",
				icon: "none"
			})
		}
		// 将 内容放入缓存并更新
		photosList.value[currentIndex.value].show = show.value
		photosList.value[currentIndex.value].remark = remark.value
		uni.setStorageSync("storgPhotosList", photosList.value)
		clickRefineClose()
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
				src: currentInfo.value.picUrl,
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
			currentIndex.value === 0 ? photosList.value.length - 1 : currentIndex.value - 1,
			currentIndex.value,
			currentIndex.value === photosList.value.length - 1 ? 0 : currentIndex.value + 1
		)

		// 数组去重
		readImgs.value = [...new Set(readImgs.value)]
	}

	// 验证我的下载
	async function checkDownload() {
		try {
			let {
				id
			} = currentInfo.value
			let params = {
				id
			}
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
			path: "/pages/photos/preview?id=" + currentInfo.value.id + "&type=share"
		}
	})
</script>

<style lang="scss" scoped>
	.preview {
		width: 100%;
		height: 100vh;
		position: relative;
		background-color: #3B3B3B;

		swiper {
			width: 100%;
			height: 100%;

			.line {}

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

	.refinePopup {
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
	
	.movable-view {
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    height: 100%;
	    width: 100%;
	    text-align: center;
	}
	
	.movable-area {
		width: 100vw;
	    height: 100vh;
	}
	
	.movable-view image {
	    width: 100%;
		height: 100%;
	}
	
	.lookimg {
	    display: block;
	    position: fixed;
	    left: 0;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    margin: auto;
	}
</style>