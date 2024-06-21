<template>
	<view class="contaier" v-if="homeDetail">
		<home-header :title="homeDetail.name" :url="homeDetail.picUrl" />
		<view class="wrap">
			<view class="page-box">
				<template v-if="areaList && areaList.length > 0">
					<view class="order" v-for="area in areaList" :key="area.id">
						<view class="top">
							<view class="left">
								<uni-text class="cuIcon-titles text-blue"></uni-text>
								<view class="store">{{ area.name }}</view>
								<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
							</view>
							<view class="right">
								<view class="progressBox">
									<up-icon name="edit-pen" size="25" @click="editArea(area)"></up-icon>
								</view>
								<view class="progressBox">
									<up-icon name="trash" size="25" @click="confirmDeleteArea(area)"></up-icon>
								</view>
							</view>
						</view>
						<u-line color="#f1f1f1" margin="24rpx 0 15rpx 0"></u-line>
						<view class="bottom">
							<view v-if="area.materials">
								<view class="cu-avatar-group" style="padding-left: 24rpx;">
									<up-avatar v-for="material in area.materials" :key="material.id"
										text="material.name" fontSize="18" randomBgColor />
								</view>
								<text class="text-blue text-shadow">物品总数: {{ area.materials.length}} 件</text>
							</view>
							<view v-else>
								<text class="text-blue text-shadow">暂无物品</text>
							</view>
							<view class="btnBox">
								<view @click="goArea(area.id)" class="evaluate btn">区域信息</view>
							</view>
						</view>
					</view>
					<view class="loadinglayout" v-if="areaList.length">
						<uni-load-more :status="noData ? 'noMore' : 'loading'" />
					</view>
				</template>
				<view v-else class="center">
					<image src="https://cdn.chouy.xyz/static/empty/comment.png" mode="widthFix"></image>
					<view class="explain">
						暂无区域信息
						<view class="tips"></view>
					</view>
				</view>
				<up-button color="linear-gradient(45deg, #28b389, #beecd8)" :customStyle="{width: '200rpx'}"
					shape="circle" icon="plus" iconColor="#fff" @click="areaShow = true">添加区域</up-button>
			</view>

		</view>

		<up-popup :show="areaShow" mode="center">
			<view class="areaPopup">
				<view class="popHeader">
					<view></view>
					<view class="title">{{areaForm.id ? '修改区域' : '创建区域'}}</view>
					<view class="close" @click="closeAreaPopup">
						<uni-icons type="closeempty" size="18" color="#999" />
					</view>
				</view>
				<view class="content">
					<up-form :model="areaForm" :rules="areaFormRules" ref="uFormRef" style="width: 100%;">
						<view class="cu-form-group margin-top solid-bottom">
							<up-form-item labelWidth="80" style="width: 100%;" label="区域名" prop="name">
								<up-input v-model="areaForm.name" placeholder="请输入区域名" border="surround" clearable />
							</up-form-item>
						</view>
						<view class="cu-form-group">
							<up-form-item labelWidth="80" style="width: 100%;" label="区域照片" prop="pic_url">
								<up-upload :fileList="uploadPhotos" @afterRead="afterRead" @delete="deletePic" name="1"
									multiple :maxCount="1" :previewFullImage="true">
								</up-upload>
							</up-form-item>
						</view>
					</up-form>
				</view>
				<view class="foot">
					<view class="padding margin-top-xs">
						<up-button color="linear-gradient(45deg, #28b389, #beecd8)" shape="circle" @click="updateArea"
							:text="areaForm.id ? '更新' : '创建'"></up-button>
					</view>
				</view>
			</view>
		</up-popup>

		<!-- 删除确认模态框 -->
		<up-modal :show="confirmDelete" @confirm="DeleteArea" @cancel="confirmDelete = false" ref="uModal" asyncClose
			buttonReverse showCancelButton>确认删除{{deleteParams.name}}吗？</up-modal>
	</view>
</template>

<script setup>
	import { requestApi } from '@/api/apis';
	import { QINIU_URL, FILE_URL } from '@/utils/config';

    const homeDetail = ref(null)
	const areaList = ref([])
	const noData = ref(false)
	const areaShow = ref(false)
	const uploadPhotos = ref([])
	const confirmDelete = ref(false)
	// 表单引用
	const uFormRef = ref(null);
	const areaForm = ref({
		id: null,
		name: "",
		pic_url: ""
	})

	// 查询参数
	var queryParams = {
		page: 1,
		perPage: 12
	}

	// 删除参数
	const deleteParams = ref({ id: null, name: "" })

	/* 校验规则 */
	const areaFormRules = {
		name: [{
			required: true,
			message: "请输入区域名",
			trigger: ["blur", "change"]
		}, {
			asyncValidator: (rule, value, callback) => {
				if (areaForm.value.id > 0) {
					callback()
				} else {
					// 添加的时候查询是否存在相同名称相册
					requestApi('home-check', {
						name: value,
						pid: homeDetail.value.id
					}).then(res => {
						if (typeof(res) == 'undefined') {
							callback();
						} else {
							callback(new Error('已存在同名区域'));
						}
					})
				}
			},
			// 触发器可以同时用blur和change
			trigger: ['blur'],
		}],
		pic_url: {
			required: true,
			type: 'string',
			message: "请上传区域图片",
			trigger: ["blur", "change"]
		}
	}

	/* 加载完毕 */
	onLoad(e => {
		let {id} = e
		
		//  获取房间信息
		getHome(id)
	})

	/* 触底触发事件 */
	onReachBottom(() => {
		if (noData.value) return
		queryParams.page++
		 getAreaList()
	})
	
	/* 观察事件 */
	watch(areaShow, (newVal, oldVal) => {
		if(newVal == false) {
			initData()
		}
	})

	/* 删除照片 */
	const deletePic = async e => {
		let pic = uploadPhotos.value[e.index]
		let deleteParams = {
			url: pic.url,
			pid: homeDetail.value.id,
			type: 'area'
		}

		await requestApi('image-delete', deleteParams, { method: 'DELETE' }).then(res => {
			uploadPhotos.value.splice(e.index, 1);
		})
	};

	/* 新增照片 */
	const afterRead = async e => {
		// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		let lists = [].concat(e.file);
		let fileListLen = uploadPhotos.value.length;
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
			// 更新到表单参数中
			areaForm.value.pic_url = FILE_URL + "/" + pic.key
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

		qiniuParam.key = "homes/" + user.member.id + "/" + homeDetail.value.id + "/" + new Date().getTime() + Math
			.floor(Math.random() * 1000) + suffix;

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

	/* 创建/修改区域 */
	const updateArea = () => {
		uFormRef.value.validate().then(async valid => {
			if (valid) {
				let target = "home-add"
				let isSplic = false
				if (areaForm.value.id > 0) {
					target = "home"
					isSplic = true
				}
				await requestApi(target, areaForm.value, {
					method: 'POST'
				}, isSplic).then(res => {
					uni.showToast({
						title: '更新成功！',
						icon: 'none'
					});

					// 刷新区域
					 getAreaList()
				})
			}
			areaShow.value = false
		});
	}

	/* 获取区域列表 */
	const  getAreaList = async () => {
		areaList.value = []
		let list = await requestApi('home-index', queryParams)

		if (queryParams.perPage > list.length) noData.value = true

		areaList.value = list

		uni.stopPullDownRefresh()
	}

	/* 关闭弹出层 */
	const closeAreaPopup = () => {
		areaShow.value = false
	}

	/* 编辑区域 */
	const editArea = area => {
		areaForm.value.id = area.id
		areaForm.value.name = area.name
		areaForm.value.pic_url = area.picUrl
		uploadPhotos.value = []
		uploadPhotos.value.push({
			url: area.picUrl
		})

		areaShow.value = true
	}

	/* 确认删除区域 */
	const confirmDeleteArea = area => {
		confirmDelete.value = true
		deleteParams.value.id = area.id
		deleteParams.value.name = area.name
	}

	/* 删除区域 */
	const DeleteArea = async () => {
		if (deleteParams.value.id > 0) {
			await requestApi('home', deleteParams.value, { method: 'DELETE' }, true)
				.then(res => {
					// 刷新区域
					 getAreaList()
				}).catch(() => {
					uni.showToast({
						title: '删除失败',
						icon: "none"
					})
				}).finally(() => {
					confirmDelete.value = false
				})
		} else {
			uni.showToast({
				title: '请选择要删除的区域',
				icon: "none"
			})
			confirmDelete.value = false
		}
	}
	
	/* 获取房间信息 */
	const getHome = async id => {
		homeDetail.value = await requestApi('home', {id}, {}, true)
		
		// 设置查询条件pid和表单 pid
		queryParams.pid = homeDetail.value.id
		areaForm.value.pid = homeDetail.value.id
		
		// 获取区域列表
		 getAreaList()
	}

	/* 跳转区域 */
	const goArea = id => {
		let url = "./materials?id=" + id
		uni.navigateTo({ url })
	}
	
	/* 初始化数据 */
	const initData = () => {
		areaForm.value = {
			id: null,
			pid: homeDetail.value.id,
			name: "",
			pic_url: ""
		}
		
		uploadPhotos.value = []
		
		deleteParams.value = {id: null, name: ""}
	}
</script>

<style lang="scss" scoped>
	.order {
		width: 710rpx;
		background-image: repeating-linear-gradient(45deg, #beecd8, #F9F8EB);
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;
		box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.10);

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
				display: flex;
				justify-content: space-between;

				.progressBox {
					width: 50rpx;
					margin-left: 10rpx;
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
		}


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

	.areaPopup {
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