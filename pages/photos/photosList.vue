<template>
	<view class="photoslist pageBg">
		<view class="loadinglayout" v-if="!photosList.length">
			<uni-load-more status="loading" />
		</view>

		<view class="content">
			<template v-if="isLongTap">
				<view class="item" v-for="(item,index) in photosList" :key="item.id" >
					<image class="item-image" :src="item.smallPicUrl" mode="aspectFill"></image>
					<image v-if="!item.checked" class="checkIcon" @click="checkImg(item.id)" src="@/static/images/icons/icon_uncheck.svg" mode="widthFix"></image>
					<image v-if="item.checked" class="checkIcon" @click="checkImg(item.id)" src="@/static/images/icons/icon_checked.svg" mode="widthFix"></image>
				</view>
			</template>
			<template v-else>
				<view @longtap="longtap" class="item" @click="redirectToUrl('/pages/photos/preview?id=' + item.id)" v-for="item in photosList" :key="item.id">
					<image class="item-image" :src="item.smallPicUrl" mode="aspectFill"></image>
				</view>
			</template>
		</view>
		
		<up-popup v-if="isLongTap" :show="longtapPopup" :round="20" mode="bottom" :overlay="false">
			        <view class="bottom-view">
						<view class="grid" @click="allChecked">
							<up-icon name="list-dot" />
							<text>全选</text>
						</view>
						<view class="grid" @click="longtapPopupClose">
							<up-icon name="close" />
							<text>取消</text>
						</view>
						<view class="grid" @click="delImg">
							<up-icon name="trash" />
							<text>删除</text>
						</view>
			        </view>
		</up-popup>
		
		<!-- 底部安全区域 -->
		<view class="safe-area-inset-bottom-custom"></view>
	</view>
</template>

<script setup>
	import { requestApi } from '@/api/apis';
	import { gotoHome } from '@/utils/common.js'
	
	const photosList = ref(uni.getStorageSync("storagePhotosList") ? uni.getStorageSync("storagePhotosList") : [])

	const props = defineProps({
		name: {
			type: String,
			default: ""
		}
	})
	
	const isLongTap = ref(false)
	const longtapPopup = ref(false)

	// 加载完毕获取请求参数
	onLoad(() => {
		// 设置头部标题
		if (props.name) uni.setNavigationBarTitle({
			title: props.name
		})
	})

	// 离开页面清除缓存
	onUnload((e) => {
		uni.removeStorageSync('storagePhotosList')
	})
	
	/* 跳转 */
	const redirectToUrl = url => {
		// 如果没有触发长按事件
		if(isLongTap.value === false) {
			uni.navigateTo({url})
		}
	}
	
	/* 长按事件 */
	const longtap = () => {
		isLongTap.value = true
		longtapPopup.value = true
	}
	
	/* 选中图片 */
	const checkImg = id => {
		let photo = photosList.value.find(i => {return i.id === id})
		photo.checked = !photo.checked
	}
	
	/* 全选图片 */
	const allChecked = () => {
		photosList.value.forEach(item => {
			item.checked = true
		})
	}
	
	/* 取消选中(关闭长按弹出层) */
	const longtapPopupClose = () => {
		// 取消选中
		photosList.value.forEach(item => {
			item.checked = false
		})
		
		// 修改状态
		isLongTap.value = false
	}
	
	/* 删除照片 */
	const delImg = async () => {
		let delPhotoIds = []
		photosList.value.forEach(p => {
			if(p.checked === true) {
				delPhotoIds.push(p.id)
			} 
		})
		
		await requestApi('batchDeletePhoto', {id: delPhotoIds}, {method: 'delete'}).then(res => {
			uni.showToast({
				title: "删除成功!",
				icon: "none"
			})
			
			// 去掉已删除的照片
			photosList.value = photosList.value.filter(p => {return delPhotoIds.indexOf(p.id) === -1 })
		})
	}
</script>

<style lang="scss">
	.photoslist {
		.content {
			position: relative;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 5rpx;
			padding: 5rpx;

			.item {
				position: inherit;
				height: 440rpx;
								
				&-image {
					width: 100%;
					height: 100%;
					display: block;
				}
				
				.checkIcon {
					position: absolute;
					right: 15rpx;
					top: 10rpx;
					width: 40rpx !important;
					height: 40rpx !important;
				}
			}
		}
		
		.bottom-view {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 5rpx;
			padding: 5rpx;
			height: 100rpx;
			.grid {
				place-self: center;
			}
		}
	}
</style>