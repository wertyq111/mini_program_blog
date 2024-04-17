const BASE_URL = "https://tea.qingnian8.com/api"
const LOGIN_URL = "http://10.10.9.184:3925/api"
const HEADERS = {
	Authorization: "",
	"access-key": "uniappstudy1458"
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
	if(!uni.getStorageSync('token') && url !== 'login:/easywechat/mini_program/authorizations') {
		uni.navigateTo({
			url: "/pages/login/login?url=" + route
		})
		return false
	}
	
	let target = "net"
	
	if(url.search(/^login\:/i) >= 0) {
		url = LOGIN_URL + url.replace(/login\:/, "")
		target = "local"
	} else {
		url = BASE_URL + url;
	}
	

	header = Object.assign({}, HEADERS, header);
	
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			data,
			method,
			header,
			success: res => {
				let code = target === 'net' ? res.data.errCode : res.data.code
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
					let errMsg = target === 'net' ? res.data.errMsg : res.data.data ? res.data.data.message : res.data.msg
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