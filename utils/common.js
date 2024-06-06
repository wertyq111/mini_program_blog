/* 时间戳转换成距离今天时间 */
export function compareTimestamp(timestamp) {
	const currentTime = Math.round(new Date().getTime() / 1000);
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

/* 返回首页 */
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

/* sleep */
export const sleep = (time) => {
	return new Promise(resolve => {
		setTimeout(resolve, time);
	})
}

/*  月份阿拉伯数字转换成中文数字 */
export const compareUppercaseDate = (number, type) => {
	let dateNum = {
		year: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
		month: ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
		week: ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
	}
	
	/* 转换年份 */
	let compareYear = (temp) => {
		let strArr = temp.toString().split("");
		let newNumber = "";
		for(let i = 0; i < strArr.length; i++) {
			newNumber += dateNum['year'][strArr[i]]
		}
		return newNumber;
	}
	
	// 转换成整型
	number = parseInt(number);
	
	// 根据转换类型进行转换
	switch(type) {
		case 'year':
		    return compareYear(number)
		case 'day':
			return number < 10 ? "0" + number : number
		default:
			return dateNum[type][number]
	}
}