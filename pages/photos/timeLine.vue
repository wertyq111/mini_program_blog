<template>
	<custom-nav-bar :title="album ? album.name : '未知相册'" :isBack="true" backClass="detail" />
	<view v-if="album" class="u-page__upload-item">
		<up-collapse accordion>
			<up-collapse-item title="上传照片">
				<template v-slot:icon>
					<up-icon name="photo" size="20"></up-icon>
				</template>
				<up-upload :fileList="uploadPhotos" @afterRead="afterRead" @delete="deletePic" name="1" multiple
					:maxCount="10"></up-upload>
			</up-collapse-item>
		</up-collapse>
	</view>

	<view v-if="album">
		<view v-for="(year, index) in timeLine" :key="index">
			<common-title>
				<template #name><text class="text-xl text-bold text-shadow">{{year.year}}</text></template>
				<template #abc><text class="text-ABC">TIMELINE</text></template>
			</common-title>
			<view v-for="(month, mindex) in year.month" :key="mindex">
				<view class="bg-white padding-lr padding-bottom-sm text-bold text-black">
					{{compareUppercaseDate(month.month, 'month')}}月
				</view>
				<view class="bg-white padding-lr padding-bottom-sm">
					<view class="grid col-3 grid-square">
						<view @click="goPhotosList(day, year.year, month.month, day.date)" class="bg-img"
							v-for="(day, dindex) in month.day" :key="dindex"
							:style="[{ backgroundImage:'url(' + day.url + ')' }]">
							<view class="imageBgBlack">
								<view class="text-sm text-white">{{day.day}}</view>
								<view class="text-white" style="font-size: 60rpx;margin: 6rpx 0 6rpx 0;">{{day.date}}
								</view>
								<view class="text-sm text-white">{{day.num}}张</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<up-empty v-else text="还没有照片" icon="https://cdn.chouy.xyz/static/empty/data.png"></up-empty>
</template>

<script setup>
	import {
		requestApi
	} from '@/api/apis';
	import {
		compareUppercaseDate
	} from '@/utils/common.js'
	import {
		QINIU_URL,
		FILE_URL
	} from '@/utils/config';

	const uploadPhotos = ref([])
	const timeLine = ref([])
	const album = ref(null)

	onLoad(e => {
		getAlbum(e.id)
	})

	/* 获取相册信息 */
	const getAlbum = async id => {
		album.value = await requestApi('albumInfo', {
			id: id
		}, {}, true)

		if (album.value.num > 0) {
			generateTimeLine(album.value.photosList)
		}
	}

	/* 生成时间进程 */
	const generateTimeLine = (photos) => {
		let data = []
		for (let i = 0; i < photos.length; i++) {
			let date = new Date(photos[i].date)
			let year = date.getFullYear()
			let month = (date.getMonth() + 1)
			let day = date.getDate()

			// 查询数组中是否存在对应年份
			if (!data.find(i => {
					return i.year == year
				})) {
				data.push({
					year
				})
			}

			// 找到年份索引
			let yearIdx = data.findIndex(i => {
				return i.year === year
			})

			if (!data[yearIdx]['month']) {
				data[yearIdx]['month'] = []
			}

			// 找到月份索引
			let monthIdx = data[yearIdx]['month'].findIndex(i => {
				return i.month === month
			})

			if (monthIdx === -1) {
				data[yearIdx]['month'].push({
					month
				})
				monthIdx = data[yearIdx]['month'].findIndex(i => {
					return i.month === month
				})
			}

			let num = 1;

			if (!data[yearIdx]['month'][monthIdx]['day']) {
				data[yearIdx]['month'][monthIdx]['day'] = []
			}

			// 找到日期索引
			let dayIdx = data[yearIdx]['month'][monthIdx]['day'].findIndex(i => {
				let dayString = day < 10 ? "0" + day : day
				return i.date === dayString
			})

			if (dayIdx >= 0) {
				data[yearIdx]['month'][monthIdx]['day'][dayIdx].num += 1
				data[yearIdx]['month'][monthIdx]['day'][dayIdx].list.push({
					id: photos[i].id,
					picUrl: photos[i].url,
					smallPicUrl: photos[i].thumbnailUrl,
					remark: photos[i].remark,
					show: photos[i].show
				})
			} else {
				data[yearIdx]['month'][monthIdx]['day'].push({
					day: compareUppercaseDate(date.getDay(), 'week'),
					date: compareUppercaseDate(date.getDate(), 'day'),
					url: photos[i].thumbnailUrl,
					list: [{
						id: photos[i].id,
						picUrl: photos[i].url,
						smallPicUrl: photos[i].thumbnailUrl,
						remark: photos[i].remark,
						show: photos[i].show
					}],
					num: 1
				})
			}
		}

		timeLine.value = data
	}

	/* 删除照片 */
	const deletePic = (event) => {
		//uploadPhotos.value.splice(event.index, 1);
	};

	/* 新增照片 */
	const afterRead = async (event) => {
		// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		let lists = [].concat(event.file);
		let fileListLen = uploadPhotos.value.length;
		let savePhotos = {
			category_id: album.value.id,
			url: []
		}
		lists.map((item) => {
			uploadPhotos.value.push({
				...item,
				status: 'uploading',
				message: '上传中',
			});
		});

		for (let i = 0; i < lists.length; i++) {
			let pic = await uploadFilePromise(lists[i].url);
			let item = uploadPhotos.value[fileListLen];
			uploadPhotos.value.splice(fileListLen, 1, {
				...item,
				status: 'success',
				message: '',
				url: FILE_URL + "/" + pic.key
			});
			fileListLen++;
			savePhotos.url.push(FILE_URL + "/" + pic.key)
		}

		// 图片地址保存到服务器上
		if (savePhotos.url.length > 0) {
			await requestApi('addPhoto', savePhotos, {
				method: 'POST'
			})
		}

		uploadPhotos.value = [];

		// 更新相册
		getAlbum(album.value.id)
	};

	/* 上传照片 */
	const uploadFilePromise = async (url) => {
		let user = uni.getStorageSync('user')
		let suffix = "";
		let qiniuParam = {
			token: "",
			key: ""
		}

		// 获取 token
		let qiniuToken = await requestApi('getQiniuToken', {}, {
			header: {
				Authorization: uni.getStorageSync('token')
			}
		})

		qiniuParam.token = qiniuToken.upToken

		if (url.lastIndexOf('.') !== -1) {
			suffix = url.substring(url.lastIndexOf('.'));
		}

		qiniuParam.key = "photos/" + user.member.id + "/" + album.value.id + "/" + new Date().getTime() + Math
			.floor(Math
				.random() *
				1000) +
			suffix;

		return new Promise((resolve, reject) => {
			let a = uni.uploadFile({
				url: QINIU_URL, // 仅为示例，非真实的接口地址
				filePath: url,
				name: 'file',
				header: {
					"Content-Type": "multipart/form-data"
				},
				formData: {
					token: qiniuParam.token, //后端返回的token
					key: qiniuParam.key
				},
				success: (res) => {
					let pic = JSON.parse(res.data)
					resolve(pic);
				},
				fail: function(res) {
					reject(res.data.data)
				}
			});
		});
	};

	/* 跳转到照片集 */
	const goPhotosList = (data, year, month, day) => {
		let name = year + "年" + (month < 10 ? "0" + month : month) + "月" + day + "日"
		let url = "/pages/photos/photosList?name=" + name
		uni.setStorageSync('storagePhotosList', data.list)
		uni.navigateTo({url})
	}
</script>

<style lang="scss" scoped>
	.imageBgBlack {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		position: absolute;
		text-align: center;
		display: flex;
		flex-flow: column;
		justify-content: center;
	}
</style>