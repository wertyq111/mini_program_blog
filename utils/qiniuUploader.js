import { requestApi } from '@/api/apis.js';

const upload_url = 'https://up.qiniup.com'

const download_url = 'https://cdn.chouy.xyz'

const qiniuParam = {
	token: "",
	key: ""
}

// 上传图片
export const upload = async (imageUrl, imageName, isNet = false) => {
	let errorMsg = null
	let tempFilePath = null

	qiniuParam.key = imageName
	
	// 如果是网络图片先下载到本地
	if (isNet === true) {
		tempFilePath = await downloadImage(imageUrl)
	} else {
		tempFilePath = imageUrl
	}
	
	// 获取七牛云上传 token
	if(!qiniuParam.token) {
		let result = await requestApi('getQiniuToken')
		qiniuParam.token = result.upToken
	}
		
	return new Promise((resolve, reject) => {
		// 上传图片
		if (tempFilePath !== null) {
			uni.uploadFile({
				url: upload_url, //此处为华东地区
				name: 'file',
				filePath: tempFilePath,
				header: {
					"Content-Type": "multipart/form-data"
				},
				formData: {
					token: qiniuParam.token, //后端返回的token
					key: qiniuParam.key
				},
				success: function(res) {
					let pic = JSON.parse(res.data)

					resolve({
						pic_url: pic.key
					})
				},
				fail: error => {
					uni.showToast({
						title: error.data,
						icon: "none"
					})
					reject(error.data)
				}
			});
		}
	})
}

// 生成图片名称
export const generateImageName = (imageUrl, dir, suffix = false) => {
	if (!suffix) {
		if (imageUrl.lastIndexOf('.') !== -1) {
			suffix = imageUrl.substring(imageUrl.lastIndexOf('.'));
		}
	}
	
	return dir + new Date().getTime() + Math.floor(Math.random() * 1000) + suffix
}

// 下载图片
const downloadImage = (imageUrl) => {
	return new Promise((resolve, reject) => {
		uni.downloadFile({
			url: imageUrl,
			timeout: 600,
			success: res => {
				if (res.statusCode === 200) {
					resolve(res.tempFilePath)
				}
			},
			fail: error => {
				uni.showToast({
					title: error.data,
					icon: "none"
				})
				reject(error.data)
			}
		})
	})
	
}