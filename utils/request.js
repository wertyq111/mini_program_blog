import {BASE_URL} from "@/utils/config.js"

const HEADERS = {
	Authorization: ""
}

export function request(url, data = {}, config = {}) {
	let {
		method,
		header
	} = config
	
	// 每次发起请求都更新一次头
	if(HEADERS.Authorization === "") {
		HEADERS.Authorization = uni.getStorageSync('token') || ""
	}
	
	let curPage = getCurrentPages();

	let route = curPage[curPage.length - 1].route; //获取当前页面的路由
	// 如果没有登录自动跳转到登录页面
	if(!uni.getStorageSync('user') && url != '/users/getUserInfo' && url !== '/easywechat/mini_program/authorizations') {
		uni.navigateTo({
			url: "/pages/login/login?url=" + route
		})
		return false
	}
	
	url = BASE_URL + url;

	header = Object.assign({}, HEADERS, header);
	
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			data,
			method,
			header,
			success: res => {
				let code = res.data.code
				if (code === 0) {
					resolve(res.data.data)
				} else if (code === 400) {
					uni.showModal({
						title: "错误提示",
						content: res.data.errMsg,
						showCancel: false
					})
					reject(res.data)
				} else {
					let errMsg = res.data.data ? res.data.data.message : res.data.msg
					uni.showToast({
						title: errMsg,
						icon: "none"
					})
					reject(res.data)
				}
			},
			fail: res => {
				reject(res.data)
			}
		})
	})
}