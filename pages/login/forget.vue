<template>
	<view class="contaier">
		<view class="top-bg top-center-bg" :style="'background-image: url(https://cdn.chouy.xyz/login/logo-2.png);'">
			<go-to :is-back="true" />
			<view class="text-bold text-xxxl">子曰小窝</view>
			<view class="margin-top-xs">修改密码</view>
			<image src='https://cdn.chouy.xyz/login/wave-2.gif' mode='scaleToFill' class='gif-wave'></image>
		</view>

		<view class="input-box padding-lr">
			<form>
				<view class="cu-form-group margin-top">
					<view class="title">手机号</view>
					<input placeholder="请输入手机号" name="phone" v-model="phone" @blur="getCaptcha"></input>
				</view>
				<view class="cu-form-group solid-bottom">
					<view class="title">验证码</view>
					<input placeholder="请输入验证码" name="captcha" v-model="captcha"></input>
					<image :src="captchaImage" mode='scaleToFill' class='gif-wave'
						style="width:200rpx;height:70rpx;margin-right:6rpx;" @click="refreshCaptcha"></image>
				</view>
				<view class="cu-form-group">
					<view class="title">验证码</view>
					<input placeholder="请输入短信验证码" name="mobileCaptcha" v-model="mobileCaptcha"></input>
					<button class="cu-btn block round bg-login-zl margin-tb-sm lg" 
					:disabled="!mobileButtonFlag ? true : false" style="width:37%" 
					@click="getMobileCaptcha">{{ mobileButtonText }}</button>
				</view>
				<view class="cu-form-group">
					<view class="title">新密码</view>
					<input placeholder="请输入新密码" name="password" :password="isShowPassword" v-model="password" />
					<uni-icons :type="isShowPassword === true ? 'eye' : 'eye-slash'" size="20"
						@click="showPassword()"></uni-icons>
				</view>
				<view class="cu-form-group">
					<view class="title">确认密码</view>
					<input placeholder="请输入密码" name="confirmPassword" :password="isShowPassword" v-model="confirmPassword"  @blur="checkPassword"/>
					<uni-icons :type="isShowPassword === true ? 'eye' : 'eye-slash'" size="20"
						@click="showPassword()"></uni-icons>
				</view>
			</form>
		</view>

		<view class="padding margin-top-xs">
			<button class="cu-btn block round bg-login-zl margin-tb-sm lg" @click="forget">修改密码</button>
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
	const confirmPassword = ref("")
	const phone = ref("")
	const mobileCaptcha = ref("")
	const mobileCaptchaKey = ref("")
	const mobileButtonText = ref("获取验证码")
	const mobileButtonFlag = ref(true)

	/* 加载完页面预处理 */
	onLoad((e) => {
		let {
			url
		} = e
		redirectUrl.value = url
	})

	/* 是否显示密码 */
	const showPassword = () => {
		isShowPassword.value = !isShowPassword.value
	}

	/* 刷新验证码 */
	const refreshCaptcha = async () => {
		let res = await requestApi('captcha', {'phone': phone.value})
		captchaImage.value = res.captcha_image_content
		captchaKey.value = res.captcha_key
	}
	
/* 确认密码一致 */
	const checkPassword = () => {
		if (!confirmPassword.value || !password.value || confirmPassword.value !== password.value) {
			uni.showToast({
				title: '两次密码不一致！',
				icon: 'none'
			});
			return false
		}

		return true
	}
	
	/* 手机号验证 */
	const checkMobile = () => {
		// 验证手机号
		if (!phone.value) { //判断如果手机号（this.tele）为空，提示用户输入手机号
			uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return false
		}
		
		let reg = /^1[3456789]\d{9}$/
		if (!reg.test(phone.value)) { //判断手机号格式时候正确
			uni.showToast({
				title: '请输入正确的手机号',
				icon: 'none'
			})
			return false
		}
	}
	
	/* 验证表单 */
	const checkForm = () => {		
		// 验证各个字段
		if(checkMobile() == false) {
			return false;
		}
	}
	
	/* 获取图片验证码 */
	const getCaptcha = async () => {
		if(checkMobile() != false) {
			// 查询手机号是否存在对应用户账号
			await requestApi('queryUsername', {phone: phone.value}).then(res => {
				if(res.username) {
					username.value = res.username
					// 刷新验证码
					refreshCaptcha()
					return 
				} else {
					uni.showToast({
						title: '找不到对应的账号',
						icon: 'none'
					})
				}
			})
			
			captchaImage.value = ""
			captchaKey.value = ""
		} else {
			return
		}
	}
	
	/* 获取短信验证码 */
	const getMobileCaptcha = async () => {
		// 验证表单
		if(checkForm() == false) {
			return
		}
		
		// 图形验证码是否存在
		if(!captchaImage.value || !captchaKey.value) {
			uni.showToast({
				title: '验证码无效，请刷新',
				icon: 'none'
			})
			return
		}
		
		// 等待获取验证码
		if (mobileButtonFlag.value == false) {
			return
		}
	
		// 验证表单
		let params = {
			captcha: captcha.value,
			captcha_key: captchaKey.value
		}
		await requestApi('mobileCaptcha', params, {
			method: 'POST'
		}).then(res => {
			if (res.key) {
				uni.showToast({
					title: '验证码发送成功！',
					icon: 'none'
				});
				mobileCaptchaKey.value = res.key
				
				mobileButtonFlag.value = false;
				let time = 60
				mobileButtonText.value = '重新获取' + time + 's'
				let timer = setInterval(() => {
					mobileButtonText.value = '获取验证码'
					if (time == 1) {
						mobileButtonFlag.value = true;
						clearInterval(timer)
					} else {
						time--
						mobileButtonText.value = '重新获取' + time + 's'
					}
				
				}, 1000)
			}
		}).finally(() => {
			refreshCaptcha()
		})
	}

	/* 重置密码 */
	const forget = async () => {
		// 验证两次密码是否一直
		if(checkPassword() === false) {
			return false
		}
		
		let params = {
			username: username.value,
			password: password.value,
			captcha: mobileCaptcha.value,
			captcha_key: mobileCaptchaKey.value
		}

		await requestApi("normalForget", params, {
			method: 'POST'
		}).then(async res => {
			console.log(res);
			// 清空 token
			uni.removeStorage('token')
			// 清空 token 过期时间
			uni.removeStorage('token_expired')
		
			if (uni.getStorageSync('user')) {
				let url = "/pages/login/normal-login"
				uni.reLaunch({url})
			}
			uni.showToast({ title: '修改密码成功, 请重新登录！', icon: 'none' });
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
</style>