<template>
	<view class="contaier login">
		<view class="top-bg top-center-bg" :style="'background-image: url(https://cdn.chouy.xyz/login/logo-2.png);'">
			<view class="text-bold text-xxxl">子曰小窝</view>
			<view class="margin-top-xs">欢迎使用，请先登录</view>
			<image src='https://cdn.chouy.xyz/login/wave-2.gif' mode='scaleToFill' class='gif-wave'></image>
		</view>

		<view class="input-box padding-lr">
			<up-form :model="form" :rules="rules" ref="uFormRef" style="width: 100%;">
				<view class="cu-form-group margin-top solid-bottom">
					<up-form-item labelWidth="50" style="width: 100%;" label="账号" prop="username">
						<up-input v-model="form.username" placeholder="请输入账号" border="none"></up-input>
					</up-form-item>
				</view>
				<view class="cu-form-group solid-bottom">
					<up-form-item labelWidth="50" label="密码" prop="password">
						<up-input v-model="form.password" placeholder="请输入密码" :password="isShowPassword"
							border="none" />
					</up-form-item>
					<uni-icons :type="isShowPassword === true ? 'eye' : 'eye-slash'" size="20"
						@click="showPassword()"></uni-icons>
				</view>
				<view class="cu-form-group solid-bottom">
					<up-form-item labelWidth="60" label="验证码" prop="captcha">
						<up-input v-model="form.captcha" placeholder="请输入验证码" border="none" />
					</up-form-item>
					<image :src="captchaImage" mode='scaleToFill' class='gif-wave'
						style="width:200rpx;height:70rpx;margin-right:6rpx;" @click="refreshCaptcha"></image>
				</view>
			</up-form>
		</view>

		<view class="padding margin-top-xs">
			<up-button color="linear-gradient(45deg, #28b389, #beecd8)" shape="circle"
				:disabled="buttonDisabled" @click="login">立即登录</up-button>
			<view class="text-gray flex justify-between padding-lr-sm">
				<!-- <navigator url="/pages/login/register"><text>注册账号</text></navigator> -->
				<text></text>
				<navigator url="/pages/login/forget"><text>忘记密码</text></navigator>
			</view>
		</view>
		<view class="third-login"><text>—————— 其他登录方式 ——————</text></view>
		<view class="third-list cl">
			<navigator class="third-type" url="/pages/login/login">
				<image src="../../static/images/icons/wechat.png"></image>
			</navigator>
			<navigator class="third-type" url="/pages/login/mobile-login">
				<image src="../../static/images/icons/mobile.png"></image>
			</navigator>
		</view>
	</view>
</template>

<script setup>
	import {
		requestApi
	} from '@/api/apis';


	/* 响应式表单数据 */
	const form = ref({
		username: "",
		password: "",
		captcha: "",
		captcha_key: ""
	});

	/* 校验规则 */
	const rules = {
		username: [{
			required: true,
			message: "请输入账号",
			trigger: ["blur", "change"]
		}],
		password: [{
			required: true,
			message: "请输入密码",
			trigger: ["blur", "change"]
		}],
		captcha: [
			{
				required: true,
				message: "请输入验证码",
				trigger: ["blur", "change"]
			},
			{
				pattern: /^[0-9a-zA-Z]*$/g,
				// 正则检验前先将值转为字符串
				transform(value) {
					return String(value);
				},
				message: '只能包含字母或数字'
			}
		]
	}

	// 表单引用  
	const uFormRef = ref(null);

	const captchaImage = ref("")
	const redirectUrl = ref(null)
	const isShowPassword = ref(true)

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
		form.value.captcha_key = res.captcha_key
	}

	/* 登录 */
	const login = async () => {
		uFormRef.value.validate().then(async valid => {
			if (valid) {
				await requestApi("normalLogin", form.value, {
					method: 'POST'
				}).then(async res => {
					uni.showToast({
						title: '登录成功！',
						icon: 'none'
					});
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
				})
			}
		}).finally(() => {
			refreshCaptcha()
		});
	}
</script>

<style lang="scss" scoped>
	.contaier {
		height: 100vh;
		background-color: #ffffff;
	}
</style>