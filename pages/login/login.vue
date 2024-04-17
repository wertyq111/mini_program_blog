<template>
	<view class="page-login">
		<view v-if="canIUse||canIGetUserProfile">
			<view class='content'>
				<!-- 获取用户头像 -->
				<image mode="aspectFit" :src="avatarUrl" style="width: 140rpx;height: 140rpx;"></image>
				<view class="name">登录</view>
				<view>申请获取以下权限</view>
				<text>获得你的公开信息(昵称、头像、地区等)</text>
			</view>

			<view class="login-box" v-if="isToken">
				<!--新版登录方式-->
				<button v-if="canIGetUserProfile" class='login-btn' type='primary' @click="bindGetUserInfo"> 授权登录 </button>
				<!--<button v-if="canIGetUserProfile" open-type="getPhoneNumber" class='login-btn' type='primary' @click="bindPhone"> 微信一键登录 </button>-->
				<!--旧版登录方式-->
				<button v-else class='login-btn' type='primary' open-type="getUserInfo" withCredentials="true"
					lang="zh_CN" @getuserinfo="bindGetUserInfo"> 授权登录1 </button>

			</view>
		</view>
		<view v-else class="text-center">
			请升级微信版本
		</view>
	</view>
</template>
<script setup>
	import { requestApi } from '@/api/apis.js'
	
	const canIUse = ref(uni.canIUse('button.open-type.getUserInfo') || null)
	const canIGetUserProfile = ref(true)
	const avatarUrl = ref("../../static/images/xxmLogo.png")
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
		login()
	})
	
	const login = () => {
		uni.login({
			provider: 'weixin',
			success: res => {
				if(res.code) {
					//将用户登录code传递到后台置换用户SessionKey、OpenId等信息 可参照此篇文章： https://ask.dcloud.net.cn/article/37452
					// 1.拿code调后端接口1 也就是getOpenid() 换取到SessionKey、OpenId(这个是唯一且固定不变)
					// 2.拿openId 调后端自己写的登录接口2  获取到cookie等信息 （这个cookie后期请求放在请求头上的） 登陆成功进行存储和跳转页面
					
					//这是我们的后端接口1--换取到SessionKey、OpenId
					let params = { code: res.code}
					getOpenid(params)
				} else {
					uni.showToast({
						title: "获取login_code失败",
						icon: "none",
						duration: 2000
					})
					console.log('获取login_code失败' + res.errMsg);
				}
			},
			fail: res => {
				uni.showToast({
					title: "获取login_code失败",
					icon: "none",
					duration: 2000
				})
				console.log('获取login_code失败' + res.errMsg);
			}
		})
	}


    // 授权手机
	const bindPhone = (e) => {
		console.log(e);
	}
	
	// 获取登录信息
	const getOpenid = async (param) => {
		let res = await requestApi("login", param, {method: 'POST'});
		// 保存 token
		uni.setStorageSync('token', `${res.token_type} ${res.access_token}`)
		// 保存 token 过期时间
		uni.setStorageSync('token_expired', res.expires_in)
		
		if(uni.getStorageSync('token')) {
			isToken.value = true
		}
	}
	
	// 获取用户信息
	const bindGetUserInfo = async () => {
		let user = await requestApi('getUserInfo', {
			include: 'member'
		})
		uni.setStorageSync('user', user)
		if(uni.getStorageSync('user')) {
			let redirectUrl = redirectUrl.value || "pages/"
			uni.reLaunch({
				url: "/" + redirectUrl.value
			})
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		text-align: center;

		image {
			border-radius: 100%;
		}
		.avatar-wrapper {
			position: absolute;
			top: 0;
			left: 0;
			height: 100rpx;
			width: 100%;
			opacity: 0;
		}
	}
</style>