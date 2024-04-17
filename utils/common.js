export function compareTimestamp(timestamp) {
	const currentTime = Math.round(new Date().getTime()/1000);
	const timeDiff = currentTime - timestamp;

	if (timeDiff < 60) {
		return '1分钟内';
	} else if (timeDiff < 3600) {
		return Math.floor(timeDiff / 60) + '分钟';
	} else if (timeDiff < 86400) {
		return Math.floor(timeDiff / 3600) + '小时';
	} else if (timeDiff < 2592000) {
		return Math.floor(timeDiff / 86400) + '天';
	} else if (timeDiff < 7776000) {
		return Math.floor(timeDiff / 2592000) + '月';
	} else {
		return null;
	}
}


export function gotoHome() {
	uni.showModal({
		title: "提示",
		content: "页面有误将返回首页",
		showCancel: false,
		success: (res) => {
			if (res.confirm) {
				uni.reLaunch({
					url: "/pages/index/index"
				})
			}
		}
	})
}

// sleep 方法
export const sleep = (time) => {
	return new Promise(resolve => {
		setTimeout(resolve, time);
	})
}