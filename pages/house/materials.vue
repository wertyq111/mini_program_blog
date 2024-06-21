<template>
	<view v-if="areaDetail" @longtap="getMouseXY">
		<up-image :src="areaDetail.picUrl" width="100wh" height="100vh" :showMenuByLongpress="false"
			mode="aspectFit"></up-image>
		<template v-if="materialList.length > 0">
			<view class="item" v-for="material in materialList" :key="material.id">
				<liu-rotating-menu :btnObj="material" @click="pointShow = true" :topPx="material.top" :leftPx="material.left"></liu-rotating-menu>
				<!-- <up-avatar :text="material.name" fontSize="10" randomBgColor></up-avatar>
				<text>{{material.num}}</text> -->
			</view>
		</template>
		
		<up-popup :show="pointShow" mode="center">
			<view class="materialPopup">
				<view class="popHeader">
					<view></view>
					<view class="title">{{materialForm.id ? '修改物品' : '创建物品'}}</view>
					<view class="close" @click="closePopup">
						<uni-icons type="closeempty" size="18" color="#999" />
					</view>
				</view>
				<view class="content">
					<up-form :model="materialForm" :rules="materialFormRules" ref="uFormRef" style="width: 100%;">
						<view class="cu-form-group margin-top solid-bottom">
							<up-form-item labelWidth="80" style="width: 100%;" label="物品名" prop="name">
								<up-input v-model="materialForm.name" placeholder="请输入物品名" border="surround" clearable />
							</up-form-item>
						</view>
						<view class="cu-form-group">
							<up-form-item labelWidth="80" style="width: 100%;" label="数量" prop="num">
								<up-input v-model="materialForm.num" placeholder="请输入数量" border="surround" clearable />
							</up-form-item>
						</view>
					</up-form>
				</view>
				<view class="foot">
					<view class="padding margin-top-xs">
						<up-button color="linear-gradient(45deg, #28b389, #beecd8)" shape="circle" @click="updateMaterial"
							:text="materialForm.id ? '更新' : '创建'"></up-button>
					</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup>
	import { requestApi } from '@/api/apis';
	const pointX = ref(0)
	const pointY = ref(0)
	const pointShow = ref(false)
	const pointItem = ref("")
	const materialList = ref([])
	const areaDetail = ref(null)
	// 表单引用
	const uFormRef = ref(null);
	const materialForm = ref({
		id: null,
		name: "",
		num: ""
	})
	
	/* 校验规则 */
	const materialFormRules = {
		name: {
			required: true,
			message: "请输入物品名",
			trigger: ["blur", "change"]
		},
		num: {
			required: true,
			type: 'number',
			message: "请输入数量",
			trigger: ["blur", "change"]
		}
	}
	
	// 查询参数
	var queryParams = {}
	
	// 删除参数
	const deleteParams = ref({ id: null, name: "" })
	
	onLoad( e => {
		let {id} = e
		
		// 获取区域信息
		getArea(id)
	})
	
	/* 观察事件 */
	watch(pointShow, (newVal, oldVal) => {
		if(newVal == false) {
			initData()
		}
	})


	/* 获取坐标 */
	const getMouseXY = e => {
		let { x, y } = e.detail
		if (!pointShow.value) {
			console.log('x=' + x);
			console.log('y=' + y);
			pointShow.value = true
			pointX.value = x
			pointY.value = y
		}
	}

	/* 更新物品名称 */
	const updateMaterial = () => {
		if (materialForm.value) {
			materialList.value.push({
				id: materialList.value.length,
				name: materialForm.value.name,
				left: pointX.value,
				top: pointY.value,
				children: [
					{
						type: "number",
						name: materialForm.value.num
					},
					{
						type: "icon",
						name: "edit-pen"
					},
					{
						type: "icon",
						name: "trash"
					}
				]
			})
		}
		
		pointShow.value = false
	}
	
	/* 获取区域信息 */
	const getArea = async id => {
		areaDetail.value = await requestApi('home', {id}, {}, true)
		
		// 设置查询条件house_id和表单 house_id
		queryParams.house_id = areaDetail.value.id
		materialForm.value.house_id = areaDetail.value.id
		
		// 获取物品列表
		getMaterialList()
	}
	
	/* 获取物品列表 */
	const  getMaterialList = async () => {
		materialList.value = []
		let list = await requestApi('material-list', queryParams)
		
		materialList.value = list
	}
	
	/* 关闭弹出层 */
	const closePopup = () => {
		pointShow.value = false
	}
	
	/* 初始化数据 */
	const initData = () => {
		materialForm.value = {
			id: null,
			house_id: areaDetail.value.id,
			name: "",
			num: 0
		}
		
		deleteParams.value = {id: null, name: ""}
	}
</script>

<style lang="scss" scoped>
	.anchor-point {
		background: #fff;
	}
	
	.item {
		position: absolute;
		display: flex;
		font-size: 15px;
		align-items: center;
		justify-content: center;
	}
	
	.materialPopup {
		background: #fff;
		padding: 30rpx;
		width: 70vw;
		border-radius: 30rpx;
		overflow: hidden;
	
		.popHeader {
			display: flex;
			justify-content: space-between;
			align-items: center;
	
			.title {
				color: $text-font-color-2;
				font-size: 26rpx;
			}
	
			.close {
				padding: 6rpx;
			}
		}
	
		.content {
			display: flex;
			padding: 30rpx 0;
			justify-content: center;
			align-items: center;
	
			.text {
				padding-left: 10rpx;
				color: #ffca3e;
				width: 80rpx;
				line-height: 1em;
				text-align: right;
			}
	
			.row {
				display: flex;
				padding: 16rpx 0;
				font-size: 32rpx;
				line-height: 1.7em;
				align-items: center;
				min-height: 100upx;
				justify-content: space-between;
			}
		}
	
		.footer {
			padding: 10rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>