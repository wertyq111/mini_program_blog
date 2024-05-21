<template>
	<view class="contaier">
		<view class="top-bg top-center-bg" :style="'background-image: url(https://cdn.chouy.xyz/login/logo-2.png);'">
			<view class="text-bold text-xxxl">子曰小窝</view>
			<view class="margin-top-xs">欢迎使用，请先登录</view>
			<image src='https://cdn.chouy.xyz/login/wave-2.gif' mode='scaleToFill' class='gif-wave'></image>
		</view>

		<view class="input-box padding-lr">
			<form>
				<view class="cu-form-group margin-top">
					<view class="title">账号</view>
					<input placeholder="请输入账号" name="username" v-model="username"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">密码</view>
					<input placeholder="请输入密码" name="password" :password="isShowPassword" v-model="password" />
					<uni-icons :type="isShowPassword === true ? 'eye' : 'eye-slash'" size="20"
						@click="showPassword()"></uni-icons>
				</view>
				<view class="cu-form-group solid-bottom">
					<view class="title">验证码</view>
					<input placeholder="请输入验证码" name="captcha" v-model="captcha"></input>
					<image :src="captchaImage" mode='scaleToFill' class='gif-wave'
						style="width:200rpx;height:70rpx;margin-right:6rpx;" @click="refreshCaptcha"></image>
				</view>
			</form>
		</view>

		<view class="padding margin-top-xs">
			<button class="cu-btn block round bg-login-zl margin-tb-sm lg" @click="login">立即登录</button>
			<view class="text-gray flex justify-between padding-lr-sm">
				<!-- <navigator url="/pages/login/register"><text>注册账号</text></navigator> -->
				<text></text>
				<navigator url="/pages/login/forget"><text>忘记密码</text></navigator>
			</view>
		</view>
		<view class="third-login"><text>—————— 其他登录方式 ——————</text></view>
		<view class="third-list cl">
			<navigator class="third-type" url="/pages/login/login"><image src="../../static/images/icons/wechat.png"></image></navigator>
			<navigator class="third-type" url="/pages/login/mobile-login"><image src="../../static/images/icons/mobile.png"></image></navigator>
		</view>
	</view>
</template>

<script setup>
	import {
		requestApi
	} from '@/api/apis';

	const captcha = ref("")
	const captchaImage = ref("")
	const captchaKey = ref("")
	const redirectUrl = ref(null)
	const isShowPassword = ref(true)
	const username = ref("")
	const password = ref("")

	/* 加载完页面预处理 */
	onLoad((e) => {
		let {
			url
		} = e
		redirectUrl.value = url
		refreshCaptcha()
	})

	/* 是否显示密码 */
	const showPassword = () => {
		isShowPassword.value = !isShowPassword.value
	}

	/* 刷新验证码 */
	const refreshCaptcha = async () => {
		let res = await requestApi('captcha')
		captchaImage.value = res.captcha_image_content
		captchaKey.value = res.captcha_key
	}

	/* 登录 */
	const login = async () => {
		let params = {
			username: username.value,
			password: password.value,
			captcha: captcha.value,
			captcha_key: captchaKey.value
		}

		await requestApi("normalLogin", params, {
			method: 'POST'
		}).then(async res => {
			uni.showToast({ title: '登录成功！', icon: 'none' });
			// 保存 token
			uni.setStorageSync('token', `${res.token_type} ${res.access_token}`)
			// 保存 token 过期时间
			uni.setStorageSync('token_expired', res.expires_in)
			
			let user = await requestApi('getUserInfo', {
				include: 'member'
			})
			uni.setStorageSync('user', user)
			
			if (uni.getStorageSync('user')) {
				let url = "/pages/tabtar/tabtar"
				uni.reLaunch({
					url
				})
			}
		}).catch(() => {
			refreshCaptcha()
		})
	}
</script>

<style lang="scss" scoped>
	.contaier {
		height: 100vh;
		background-color: #ffffff;
	}

	.top-bg {
		width: 750rpx;
		height: 480rpx;
		background-size: 100%;
		background-repeat: no-repeat;
		text-align: center;
		padding-top: 170rpx;
	}

	.bg-login-zl {
		background-image: linear-gradient(45deg, #28b389, #beecd8);
		color: #ffffff;
	}

	.top-center-bg {
		background: #fff;
		background-size: 100% 100%;
		/* background-size: cover; */
		height: 550rpx;
		display: flex;
		justify-content: center;
		padding-top: 40rpx;
		overflow: hidden;
		position: relative;
		flex-direction: column;
		align-items: center;
		//color: #fff;
		font-weight: 300;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.top-center-bg text {
		opacity: 0.8;
	}

	.top-center-bg image {
		width: 200rpx;
		height: 200rpx;
	}

	.top-center-bg .gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
		margin-left: 5rpx
	}
	
	.third-login {
		text-align: center;
		margin: 50rpx 0 0 0;
		color: #666;
		
		& text {
			margin-left: 20rpx;
			color: #aaaaaa;
			font-size: 27rpx;
		}
	}
	
	.third-list {
		text-align: center;
		width: 250rpx;
		margin: 80rpx auto 0;
		
		& image {
			width: 50rpx;
			height: 50rpx;
		}
	}
	
	.third-type {
		float: left;
		width: 50%;
	}
	
</style>