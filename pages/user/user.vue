<template>
	<view class="userLayout pageBg" v-if="userInfo">
		<view :style="{height: getNavBarHeight() + 'px'}"></view>
		<view v-if="token" class="userInfo">
			<view class="avatar">
				<image :src="avatarUrl" mode="" class="avatar"></image>
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar"></button>
			</view>
			<view class="username">
				<template v-if="isEdit">
					<view class="nickname-line">
						<input :value="nickname" class="nickname" type="nickname" placeholder="请输入昵称"
							@change="updateNickname" :focus="isFocus" />
					</view>
				</template>
				<template v-else>
					{{ nickname }}
					<uni-icons type="compose" size="30" @click="isEdit = true;isFocus = true"></uni-icons>
				</template>
			</view>
			<view class="address">来自于
				{{userInfo.address.city || userInfo.address.province || userInfo.address.country}}
			</view>
		</view>
		<view v-else class="userInfo">
			<navigator url="/pages/login/login">
				<view class="avatar">
					<image src="https://cdn.chouy.xyz/static/logo.png" mode=""></image>
				</view>
				<view class="ip">登录 / 注册</view>
			</navigator>
		</view>

		<view class="section" v-for="(item, index) in userConfig" :key="index">
			<view class="list">
				<user-column v-for="(child, idx) in item" :key="idx" :iconConfig="child.iconConfig"
					:textConfig="child.textConfig" :isUrl="child.isUrl" :url="child.url">
					<template v-if="child.isContact">
						<!-- #ifdef MP -->
						<template #custom><button open-type="contact" class="contact">联系客服</button></template>
						<!-- #endif -->
						<!-- #ifndef MP -->
						<template #custom><button class="contact" @click="clickContact">拨打电话</button></template>
						<!-- #endif -->
					</template>
				</user-column>
			</view>
		</view>
	</view>
	<view v-else>
		<view :style="{height: getNavBarHeight() + 'px'}"></view>
		<uni-load-more status="loading" />
	</view>
</template>

<script setup>
	import { getNavBarHeight } from '@/utils/system.js'
	import { requestApi } from '@/api/apis.js';

	const token = ref(uni.getStorageSync('token') || null)
	const userInfo = ref(null)
	const user = ref(null)
	const avatarUrl = ref("https://cdn.chouy.xyz/webAvatar/11686107681474364.jpg")
	const nickname = ref("微信小程序用户")
	const isEdit = ref(false)
	const isFocus = ref(false)
	const qiniuParam = {
		token: "",
		key: ""
	}
	const loginConfig = {
		header: {
			Authorization: uni.getStorageSync('token')
		}
	}

	const userConfig = ref(null)


	// 点击拨打电话
	const clickContact = () => {
		uni.makePhoneCall({
			phoneNumber: "15088631304"
		})
	}


	// 获取用户信息
	const getUserInfo = async () => {
		user.value = uni.getStorageSync('user')

		if (user.value.member) {
			if (user.value.member.avatar !== "") { avatarUrl.value = user.value.member.avatar }
			nickname.value = user.value.member.nickname
		}

		userInfo.value = await requestApi("memberInfo", {
			user_id: user.value.id,
			type: 'wallpaper'
		})
		userConfig.value = [{
			"download": {
				iconConfig: {
					left: {
						type: 'download-filled',
						size: 20,
					},
					right: {
						type: 'right',
						size: 15,
					}
				},
				textConfig: {
					left: '我的下载',
					right: userInfo.value.downloadSize
				},
				isUrl: true,
				url: "/pages/classlist/classlist?name=我的下载&type=download"
			},
			"score": {
				iconConfig: {
					left: {
						type: 'star-filled',
						size: 20,
					},
					right: {
						type: 'right',
						size: 15,
					}
				},
				textConfig: {
					left: '我的评分',
					right: userInfo.value.scoreSize
				},
				isUrl: true,
				url: "/pages/classlist/classlist?name=我的评分&type=score"
			},
			"contact": {
				iconConfig: {
					left: {
						type: 'chatboxes-filled',
						size: 20,
					},
					right: {
						type: 'right',
						size: 15,
					}
				},
				textConfig: {
					left: '联系客服'
				},
				isContact: true
			}
		}, {
			"sub": {
				iconConfig: {
					left: {
						type: 'notification-filled',
						size: 20,
					},
					right: {
						type: 'right',
						size: 15,
					}
				},
				textConfig: {
					left: '修改密码'
				},
				isUrl: true,
				url: "/pages/login/forget"
			},
			"question": {
				iconConfig: {
					left: {
						type: 'info-filled',
						size: 20,
					},
					right: {
						type: 'right',
						size: 15,
					}
				},
				textConfig: {
					left: '关于小程序'
				},
				isUrl: true,
				url: "/pages/user/about"
			}
		}]
	}

	// 获取用户微信头像
	const onChooseAvatar = (e) => {
		if (user.value) {
			// 将数据赋值
			let url = e.detail.avatarUrl
			avatarUrl.value = url
			uploadAvatar(avatarUrl.value);
		} else {
			uni.showToast({
				title: "未登录",
				icon: "none"
			})
		}

	}

	const uploadAvatar = async (avatarPath) => {
		let suffix = "";

		// 获取 token
		let qiniuToken = await requestApi('getQiniuToken', {}, loginConfig)
		qiniuParam.token = qiniuToken.upToken

		if (avatarPath.lastIndexOf('.') !== -1) {
			suffix = avatarPath.substring(avatarPath.lastIndexOf('.'));
		}

		qiniuParam.key = "userAvatar/" + user.value.id + "/" + new Date().getTime() + Math.floor(Math.random() *
				1000) +
			suffix;
		uni.uploadFile({
			url: 'https://up.qiniup.com', //此处为华北地区
			name: 'file',
			filePath: avatarPath,
			header: {
				"Content-Type": "multipart/form-data"
			},
			formData: {
				token: qiniuParam.token, //后端返回的token
				key: qiniuParam.key
			},
			success: async function(res) {
				let pic = JSON.parse(res.data)
				let params = {
					id: user.value.member.id,
					avatar: "https://cdn.chouy.xyz/" + pic.key
				}
				let result = await requestApi('editMember', params, {
					method: 'post'
				}, true)
				if (result.id) {
					uni.showToast({
						title: "更新成功",
						icon: "none"
					})
					avatarUrl.value = result.avatar
					user.value.member.avatar = result.avatar
					uni.removeStorageSync('user')
					uni.setStorageSync('user', user.value)
				}
			},
			fail: function(res) {
				console.log(res)
			}
		});
	}

	// watch(nickname, (currVal, oldVal) => {
	// 	console.log(currVal);
	// })

	const updateNickname = async (e) => {
		let text = e.detail.value
		if (text && text !== nickname.value) {
			let params = {
				id: user.value.member.id,
				nickname: text
			}
			let res = await requestApi('editMember', params, {
				method: 'post'
			}, true)
			if (res.id) {
				uni.showToast({
					title: "更新成功",
					icon: "none"
				})
				nickname.value = res.nickname
				user.value.member.nickname = res.nickname
				uni.removeStorageSync('user')
				uni.setStorageSync('user', user.value)
			}
		}

		isEdit.value = false
	}

	getUserInfo()
</script>

<style lang="scss" scoped>
	.userLayout {
		.userInfo {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 50rpx 0;

			.avatar {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}

				.avatar-wrapper {
					position: absolute;
					top: 220rpx;
					left: 0;
					height: 160rpx;
					width: 100%;
					opacity: 0;
				}
			}

			.username {
				font-size: 44rpx;
				color: #333;
				padding: 20rpx 0 5rpx;
			}

			.nickname {
				display: flex;
				justify-content: center;
				align-items: center;
				background: #F4F4F4;
				border-radius: 4rpx;
				height: 70rpx;
				font-size: 28rpx;
				line-height: 70rpx;
				font-weight: 500;
				color: #848484;
			}

			.ip {
				font-size: 44rpx;
				color: #333;
				padding: 20rpx 0 5rpx;
			}

			.address {
				font-size: 28rpx;
				color: #ABABAB;
			}
		}

		.section {
			width: 690rpx;
			margin: 50rpx auto;
			border: 1px solid #eee;
			border-radius: 10rpx;
			box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.05);
		}

		.list {
			.contact {
				position: absolute;
				top: 0;
				left: 0;
				height: 100rpx;
				width: 100%;
				opacity: 0;
			}
		}
	}
</style>
