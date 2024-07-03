<template>
	<view class="mainBox bg-white login">
		<view v-if="canIUse">
			<view class="top-bg top-center-bg" :style="'background-image: url(https://www.chouy.xyz:4431/static/login/logo.png);'">
				<go-to :is-back="true" backClass="login" />
				<image class="logoImg" :src="avatarUrl"></image>
				<view class="logoName text-black text-bold text-xxxl">登录</view>
				<image src='https://www.chouy.xyz:4431/static/login/wave-2.gif' mode='scaleToFill' class='gif-wave'></image>
			</view>

			<view class="padding text-center margin-top-xl">
				<view class="padding-xl radius shadow-warp bg-white margin-top">
					<view class="text-bold text-black text-xl">子曰小窝</view>
					<view class="describe margin-top-sm">欢迎使用微信一键登录。</view>
					<up-button color="linear-gradient(45deg, #28b389, #beecd8)" shape="circle" @click="bindGetUserInfo">授权登录</up-button>
				</view>
			</view>
		</view>
		<view v-else class="text-center">
			请升级微信版本
		</view>
	</view>
</template>

<script setup>
	import {
		requestApi
	} from '@/api/apis.js'

	const canIUse = ref(uni.canIUse('button.open-type.getUserInfo') || null)
	const canIGetUserProfile = ref(true)
	const avatarUrl = ref("https://cdn.chouy.xyz/static/logo.png")
	const isToken = ref(false)
	const redirectUrl = ref(null)

	// 获取用户微信头像
	const onChooseAvatar = (e) => {
		// 将数据赋值
		let url = e.detail.avatarUrl
		avatarUrl.value = url
	}

	onLoad((e) => {
		let { url } = e
		redirectUrl.value = url
	})


	// 授权手机
	const bindPhone = (e) => {
		console.log(e);
	}

	// 获取登录信息
	const getOpenid = async (param) => {
		let res = await requestApi("login", param, {
			method: 'POST'
		});
		// 保存 token
		uni.setStorageSync('token', `${res.token_type} ${res.access_token}`)
		// 保存 token 过期时间
		uni.setStorageSync('token_expired', res.expires_in)

		if (uni.getStorageSync('token')) {
			isToken.value = true
		}
	}

	// 获取用户信息
	const bindGetUserInfo = async () => {
		await login()
		
		if(isToken.value) {
			let user = await requestApi('getUserInfo', {
				include: 'member'
			})
			uni.setStorageSync('user', user)
			if (uni.getStorageSync('user')) {
				let url = redirectUrl.value ? redirectUrl.value : "/pages/tabtar/tabtar"
				uni.reLaunch({
					url
				})
			}
		}
	}
	
	/* 登录 */
	function login() {
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: async res => {
					if (res.code) {
						//将用户登录code传递到后台置换用户SessionKey、OpenId等信息 可参照此篇文章： https://ask.dcloud.net.cn/article/37452
						// 1.拿code调后端接口1 也就是getOpenid() 换取到SessionKey、OpenId(这个是唯一且固定不变)
						// 2.拿openId 调后端自己写的登录接口2  获取到cookie等信息 （这个cookie后期请求放在请求头上的） 登陆成功进行存储和跳转页面
			
						//这是我们的后端接口1--换取到SessionKey、OpenId
						let params = { 
							code: res.code
						}
						await getOpenid(params)
						resolve("登录成功")
					} else {
						uni.showToast({
							title: "获取login_code失败",
							icon: "none",
							duration: 2000
						})
						console.log('获取login_code失败' + res.errMsg);
						reject("登录失败")
					}
				},
				fail: res => {
					uni.showToast({
						title: "获取login_code失败",
						icon: "none",
						duration: 2000
					})
					console.log('获取login_code失败' + res.errMsg);
					reject("登录失败")
				}
			})
		})
	}
</script>

<style lang="scss" scoped>
	.mainBox {
		height: 100vh;

		.logoImg {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			position: absolute;
			left: 50%;
			margin-left: -70rpx;
			top: 170rpx;
			display: block;
		}

		.logoName {
			width: 750rpx;
			position: absolute;
			left: 0;
			top: 340rpx;
			text-align: center;
		}
	}
</style>