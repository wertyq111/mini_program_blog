<template>
	<view class="contaier">
		<view class="text-xxl" style="position: relative;">
			<view class="login">
				<view class="top-bg top-center-bg"
					:style="'background-image: url(https://cdn.chouy.xyz/login/logo.png);'">
					<image src='https://cdn.chouy.xyz/login/wave-2.gif' mode='scaleToFill' class='gif-wave'></image>
				</view>
				<go-to :is-back="true" backClass="login" />
			</view>

			<view style="width: 100% ;position: absolute; top: 200rpx;">
				<view class="titleImg margin-tb-xs">
					<view class="titleZi">
						<text class="cuIcon-favor margin-right-sm"></text>
						我 / 的 / 房 / 屋
						<text class="cuIcon-favor margin-left-sm"></text>
					</view>
				</view>
			</view>
		</view>

		<view class="wrap">
			<view v-if="homeList" class="page-box">

			</view>
			<view class="page-box">
				<template v-if="homeList && homeList.length > 0">
					<view class="order" v-for="home in homeList" :key="home.id">
						<view class="top">
							<view class="left">
								<uni-text class="cuIcon-titles text-blue"></uni-text>
								<view class="store">{{ home.name }}</view>
								<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
							</view>
						</view>
						<view class="item">
							<up-image :src="home.picUrl" mode="aspectFill" />
						</view>
						<u-line color="#f1f1f1" margin="24rpx 0 15rpx 0"></u-line>
						<view class="bottom">
							<view v-if="home.materials">
								<view class="cu-avatar-group" style="padding-left: 24rpx;">
									<up-avatar v-for="material in home.materials" :key="material.id"
										text="material.name" fontSize="18" randomBgColor />
								</view>
								<text class="text-blue text-shadow">物品总数: {{ home.materials.length}} 件</text>
							</view>

							<view class="btnBox">
								<view @click="goHome" class="evaluate btn">房间信息</view>
							</view>
						</view>
					</view>
					<view class="loadinglayout" v-if="homeList.length">
						<uni-load-more :status="noData ? 'noMore' : 'loading'" />
					</view>
				</template>
				<view v-else class="center">
					<image src="https://cdn.chouy.xyz/static/empty/comment.png" mode="widthFix"></image>
					<view class="explain">
						暂无房间信息
						<view class="tips"></view>
					</view>
				</view>
				<up-button color="linear-gradient(45deg, #28b389, #beecd8)" :customStyle="{width: '200rpx'}"
					shape="circle" icon="plus" iconColor="#fff" @click="homeShow = true">添加房间</up-button>
			</view>

		</view>

		<up-popup :show="homeShow" mode="center">
			<view class="homePopup">
				<view class="popHeader">
					<view></view>
					<view class="title">{{homeForm.id ? '修改房间' : '创建房间'}}</view>
					<view class="close" @click="closeHomePopup">
						<uni-icons type="closeempty" size="18" color="#999" />
					</view>
				</view>
				<view class="content">
					<up-form :model="homeForm" :rules="homeFormRules" ref="uFormRef" style="width: 100%;">
						<view class="cu-form-group margin-top solid-bottom">
							<up-form-item labelWidth="80" style="width: 100%;" label="房间名" prop="name">
								<up-input v-model="homeForm.name" placeholder="请输入房间名" border="surround" clearable />
							</up-form-item>
						</view>
						<view class="cu-form-group">
							<up-form-item labelWidth="80" style="width: 100%;" label="房间照片" prop="pic_url">
								<up-upload :fileList="uploadPhotos" @afterRead="afterRead" @delete="deletePic" name="1"
									multiple :maxCount="1" :previewFullImage="true"></up-upload>
							</up-form-item>
						</view>
					</up-form>
				</view>
				<view class="foot">
					<view class="padding margin-top-xs">
						<up-button color="linear-gradient(45deg, #28b389, #beecd8)" shape="circle"
							:text="homeForm.id ? '更新' : '创建'"></up-button>
					</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup>
	import { requestApi } from '@/api/apis';
	import { QINIU_URL, FILE_URL } from '@/utils/config';

	const homeList = ref([])
	const noData = ref(false)
	const homeShow = ref(false)
	const uploadPhotos = ref([])
	// 表单引用
	const uFormRef = ref(null);
	const homeForm = ref({
		name: "",
		pic_url: ""
	})

	var queryParams = {
		page: 1,
		perPage: 12
	}

	/* 校验规则 */
	const homeFormRules = {
		name: [{
			required: true,
			message: "请输入房间名",
			trigger: ["blur", "change"]
		}, {
			asyncValidator: (rule, value, callback) => {
				// 查询是否存在相同名称相册
				requestApi('home-check', {
					name: value
				}).then(res => {
					console.log(res);
					if (typeof(res) == 'undefined') {
						callback();
					} else {
						callback(new Error('已存在同名房间'));
					}
				})
			},
			// 触发器可以同时用blur和change
			trigger: ['blur'],
		}],
		pic_url: {
			required: true,
			type: 'file',
			message: "请上传房间图片",
			trigger: ["blur", "change"]
		}
	}

	/* 加载完毕 */
	onLoad(() => {
		getHomeList()
	})

	/* 触底触发事件 */
	onReachBottom(() => {
		if (noData.value) return
		queryParams.page++
		getHomeList()
	})

	/* 删除照片 */
	const deletePic = async e => {
		let pic = uploadPhotos.value[e.index]
		let deleteParams = {
			url: pic.url,
			type: 'home'
		} 
		
		await requestApi('image-delete', deleteParams, {method: 'DELETE'}).then(res => {
			uploadPhotos.value.splice(e.index, 1);
		})
	};

	/* 新增照片 */
	const afterRead = async (event) => {
		// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		let lists = [].concat(event.file);
		let fileListLen = uploadPhotos.value.length;
		let savePhotos = {
			url: []
		}
		lists.map((item) => {
			uploadPhotos.value.push({
				...item,
				status: 'uploading',
				message: '上传中',
			});
		});

		for (let i = 0; i < lists.length; i++) {
			let pic = await uploadFilePromise(lists[i].url);
			let item = uploadPhotos.value[fileListLen];
			uploadPhotos.value.splice(fileListLen, 1, {
				...item,
				status: 'success',
				message: '',
				url: FILE_URL + "/" + pic.key
			});
			fileListLen++;
		}
	};

	/* 上传照片 */
	const uploadFilePromise = async (url) => {
		let user = uni.getStorageSync('user')
		let suffix = "";
		let qiniuParam = {
			token: "",
			key: ""
		}

		// 获取 token
		let qiniuToken = await requestApi('getQiniuToken', {}, {
			header: {
				Authorization: uni.getStorageSync('token')
			}
		})

		qiniuParam.token = qiniuToken.upToken

		if (url.lastIndexOf('.') !== -1) {
			suffix = url.substring(url.lastIndexOf('.'));
		}

		qiniuParam.key = "homes/" + user.member.id + "/" + new Date().getTime() + Math
			.floor(Math
				.random() *
				1000) +
			suffix;

		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: QINIU_URL, // 仅为示例，非真实的接口地址
				filePath: url,
				name: 'file',
				header: {
					"Content-Type": "multipart/form-data"
				},
				formData: {
					token: qiniuParam.token, //后端返回的token
					key: qiniuParam.key
				},
				success: (res) => {
					let pic = JSON.parse(res.data)
					resolve(pic);
				},
				fail: function(res) {
					reject(res.data.data)
				}
			});
		});
	};

	/* 创建/修改房间 */
	const updateHome = () => {
		uFormRef.value.validate().then(async valid => {
			if (valid) {
				let target = "home-add"
				if (homeForm.value.id > 0) {
					target = "home"
				}
				await requestApi(target, homeForm.value, {
					method: 'POST'
				}).then(async res => {
					uni.showToast({
						title: '更新成功！',
						icon: 'none'
					});

					// 刷新房间
					getHomeList()
				})
			}
		}).finally(() => {
			homeShow.value = false
		});
	}

	/* 获取房间列表 */
	const getHomeList = async () => {
		let list = await requestApi('home-index', queryParams)
		console.log(list);

		if (queryParams.perPage > list.length) noData.value = true

		homeList.value = [...homeList.value, ...list]
		uni.stopPullDownRefresh()
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

	.order {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;

		.top {
			display: flex;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.store {
					margin: 0 10rpx;
					font-size: 34rpx;
					font-weight: bold;
				}
			}

			.right {
				color: $u-warning;

				.progressBox {
					width: 150rpx;
					float: right;
				}
			}
		}

		.item {
			display: flex;
			margin: 20rpx 0 0;

			.left {
				margin-right: 20rpx;

				image {
					width: 260rpx;
					height: 190rpx;
					border-radius: 10rpx;
				}
			}

			.content {
				.title {
					font-size: 28rpx;
					line-height: 45rpx;
				}

				.type {
					margin: 6rpx 0;
					font-size: 24rpx;
					color: $u-tips-color;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					line-clamp: 3;
					-webkit-box-orient: vertical;
				}

				.delivery-time {
					color: #0081ff;
					font-size: 24rpx;
				}
			}

			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;

				.decimal {
					font-size: 24rpx;
					margin-top: 4rpx;
				}

				.number {
					color: $u-tips-color;
					font-size: 24rpx;
				}
			}
		}

		.total {
			margin-top: 20rpx;
			text-align: right;
			font-size: 24rpx;

			.total-price {
				font-size: 32rpx;
			}
		}

		.bottom {
			line-height: 70rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.btnBox {
				width: 150rpx;
				display: flex;
				justify-content: space-between;

				.btn {
					line-height: 52rpx;
					width: 140rpx;
					border-radius: 12rpx;
					border: 2rpx solid $u-tips-color;
					font-size: 26rpx;
					text-align: center;
					color: $u-tips-color;
				}

				.evaluate {
					color: $u-primary;
					border-color: $u-primary;
				}
			}
		}
	}

	.center {
		text-align: center;
		margin: 200rpx auto;
		font-size: 32rpx;

		image {
			width: 300rpx;
			border-radius: 50%;
			margin: 0 auto;
		}

		.tips {
			font-size: 24rpx;
			color: #999999;
			margin-top: 20rpx;
		}

		.btn {
			margin: 80rpx auto;
			width: 200rpx;
			border-radius: 32rpx;
			line-height: 64rpx;
			color: #ffffff;
			font-size: 26rpx;
			background: linear-gradient(270deg, #1cbbb4 0%, #0081ff 100%);
		}
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.loadinglayout {
		padding: 30rpx 0;
	}

	.homePopup {
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