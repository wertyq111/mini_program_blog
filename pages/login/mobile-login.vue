<template>
	<view class="contaier login">
		<view class="top-bg top-center-bg" :style="'background-image: url(https://www.chouy.xyz:4431/static/login/logo.png);'">
			<go-to :is-back="true" backClass="login" />
			<view class="text-bold text-xxxl">子曰小窝</view>
			<view class="margin-top-xs">欢迎使用，请先登录</view>
			<image src='https://www.chouy.xyz:4431/static/login/wave-2.gif' mode='scaleToFill' class='gif-wave'></image>
		</view>

		<view class="input-box padding-lr">
			<up-form :model="form" :rules="rules" ref="uFormRef" style="width: 100%;">
				<view class="cu-form-group margin-top solid-bottom">
					<up-form-item labelWidth="50" style="width: 100%;" label="手机号" prop="username">
						<up-input v-model="form.username" placeholder="请输入手机号" border="none"
							@blur="getCaptcha"></up-input>
					</up-form-item>
				</view>
				<view class="cu-form-group solid-bottom">
					<up-form-item labelWidth="60" label="验证码" prop="captchaImage">
						<up-input v-model="captcha" placeholder="请输入验证码" border="none" />
					</up-form-item>
					<image :src="captchaImage" mode='scaleToFill' class='gif-wave'
						style="width:200rpx;height:70rpx;margin-right:6rpx;" @click="refreshCaptcha"></image>
				</view>
				<view class="cu-form-group">
					<up-form-item labelWidth="60" label="验证码" prop="captcha">
						<!-- <up-input v-model="form.captcha" placeholder="请输入短信验证码" border="none" @focus="showNumberKeyword = true" /> -->
						<up-code-input v-model="form.captcha" :maxlength="4" mode="line" :disabled-keyboard="true"
							@finish="showNumberKeyword = false" @tap="showNumberKeyword = true"></up-code-input>
					</up-form-item>
					<up-code :seconds="60" change-text="XS重新获取" @start="buttonDisabled = true"
						@end="buttonDisabled = false" ref="uCodeRef" @change="codeChange"></up-code>
					<up-button :custom-style="codeStyle" color="linear-gradient(45deg, #28b389, #beecd8)" shape="circle"
						@tap="getMobileCaptcha" :disabled="buttonDisabled">{{tips}}</up-button>
					<up-keyboard mode="number" @change="codeInput" @backspace="backspace" :show="showNumberKeyword"
						:showConfirm="false" :showCancel="false" tips="请输入验证码" :dotDisabled="true"
						@close="showNumberKeyword = false">
					</up-keyboard>
				</view>
			</up-form>
		</view>

		<view class="padding margin-top-xs">
			<up-button color="linear-gradient(45deg, #28b389, #beecd8)" shape="circle" @click="login">立即登录</up-button>
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
		captcha: "",
		captcha_key: ""
	});

	/* 验证码按钮样式 */
	const codeStyle = reactive({
		marginLeft: '20rpx',
		width: '40%'
	});

	/* 校验规则 */
	const rules = {
		username: [{
			validator: (rule, value, callback) => {
				// 上面有说，返回true表示校验通过，返回false表示不通过
				// uni.$u.test.mobile()就是返回true或者false的
				return uni.$u.test.mobile(value);
			},
			message: '手机号码不正确',
			// 触发器可以同时用blur和change
			trigger: ['change', 'blur'],
		}],
		captcha: [{
				required: true,
				message: "请输入短信验证码",
				trigger: ["blur", "change"]
			},
			{
				pattern: /^[0-9]*$/g,
				// 正则检验前先将值转为字符串
				transform(value) {
					return String(value);
				},
				message: '只能包含数字'
			}
		]
	}

	// 表单引用  
	const uFormRef = ref(null);
	const captcha = ref("")
	const captchaImage = ref("")
	const captchaKey = ref("")
	const redirectUrl = ref(null)
	const isShowPassword = ref(true)
	const buttonDisabled = ref(false)
	const uCodeRef = ref(null);
	const tips = ref('');
	const showNumberKeyword = ref(false);

	const codeChange = (text) => {
		tips.value = text;
	};

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
		if (form.value.username) {
			let res = await requestApi('captcha', {
				phone: form.value.username
			})
			captchaImage.value = res.captcha_image_content
			captchaKey.value = res.captcha_key
		}
	}

	/* 获取图片验证码 */
	const getCaptcha = () => {
		if (form.value.username) {
			refreshCaptcha()
			return
		} else {
			return
		}
	}

	/* 获取短信验证码 */
	const getMobileCaptcha = async () => {
		if (uCodeRef.value.canGetCode && form.value.username) {
			// 模拟向后端请求验证码
			uni.showLoading({
				title: '正在获取验证码',
			});

			// 验证表单
			let params = {
				captcha: captcha.value,
				captcha_key: captchaKey.value
			}

			await requestApi('mobileCaptcha', params, {
				method: 'POST'
			}).then(res => {
				if (res.key) {
					uni.hideLoading();
					// 这里此提示会被start()方法中的提示覆盖
					uni.$u.toast('验证码已发送');
					// 通知验证码组件内部开始倒计时
					uCodeRef.value.start();
					form.value.captcha_key = res.key
				}
			}).finally(() => {
				refreshCaptcha()
			})
		}
	}

	/* 验证码输入 */
	const codeInput = (val) => {
		// 将每次按键的值拼接到value变量中，注意+=写法
		form.value.captcha += val;
		if (form.value.captcha.length >= 4) {
			finish();
		}
	};

	/* 验证码退格 */
	const backspace = () => {
		// 删除value的最后一个字符
		if (form.value.captcha.length) {
			form.value.captcha = form.value.captcha.substr(0, form.value.captcha.length - 1);
		}
	};



	/* 验证码输入完毕 */
	const finish = () => {
		showNumberKeyword.value = false
	}

	/* 登录 */
	const login = async () => {
		let params = Object.assign({}, form.value, {
			type: 'phone'
		})

		await requestApi("normalLogin", params, {
			method: 'POST'
		}).then(async res => {
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
			uni.showToast({
				title: '登录成功！',
				icon: 'none'
			});
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
</style>