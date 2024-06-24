<template>
	<view v-if="areaDetail" @longtap="getMouseXY">
		<up-image :src="areaDetail.picUrl" width="100wh" height="100vh" :showMenuByLongpress="false"
			mode="heightFix"></up-image>
		<template v-if="materialList.length > 0">
			<view class="item" v-for="material in materialList" :key="material.id">
				<liu-rotating-menu :btnObj="material" @click="groupClick" @move="syncPoint" :topPx="material.top"
					:leftPx="material.left"></liu-rotating-menu>
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
								<up-input v-model="materialForm.name" placeholder="请输入物品名" border="surround"
									clearable />
							</up-form-item>
						</view>
						<view class="cu-form-group">
							<up-form-item labelWidth="80" style="width: 100%;" label="数量" prop="num">
								<up-input v-model="materialForm.num" placeholder="请输入数量" border="surround" clearable />
							</up-form-item>
						</view>
						<view class="cu-form-group">
							<up-form-item labelWidth="80" style="width: 100%;" label="预设颜色" prop="style">
								<l-color-picker v-if="materialForm.color" v-model="materialForm.color" :presets="presetColors"></l-color-picker>
							</up-form-item>
						</view>
					</up-form>
				</view>
				<view class="foot">
					<view class="padding margin-top-xs">
						<up-button color="linear-gradient(45deg, #28b389, #beecd8)" shape="circle"
							@click="updateMaterial" :text="materialForm.id ? '更新' : '创建'"></up-button>
					</view>
				</view>
			</view>
		</up-popup>
		
		<!-- 删除确认模态框 -->
		<up-modal :show="confirmDelete" @confirm="deleteMaterial" @cancel="confirmDelete = false" ref="uModal" asyncClose
			buttonReverse showCancelButton>确认删除{{deleteParams.name}}吗？</up-modal>
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
	const confirmDelete = ref(false)
	// 表单引用
	const uFormRef = ref(null);
	const materialForm = ref({
		id: null,
		name: "",
		num: ""
	})

	// 预设颜色
	const presetColors = [{
		label: '预设颜色',
		colors: [
			'#000000',
			'#000000E0',
			'#000000A6',
			'#00000073',
			'#00000040',
			'#00000026',
			'#0000001A',
			'#00000012',
			'#0000000A',
			'#00000005',
			'#F5222D',
			'#FA8C16',
			'#FADB14',
			'#8BBB11',
			'#52C41A',
			'#13A8A8',
			'#1677FF',
			'#2F54EB',
			'#722ED1',
			'#EB2F96',
			'#F5222D4D',
			'#FA8C164D',
			'#FADB144D',
			'#8BBB114D',
			'#52C41A4D',
			'#13A8A84D',
			'#1677FF4D',
			'#2F54EB4D',
			'#722ED14D',
			'#EB2F964D',
		],
	}]

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

	onLoad(e => {
		let { id } = e

		// 获取区域信息
		getArea(id)
	})

	/* 观察事件 */
	watch(pointShow, (newVal, oldVal) => {
		if (newVal == false) {
			initData()
		}
	})


	/* 获取坐标 */
	const getMouseXY = e => {
		let { x, y } = e.detail
		if (!pointShow.value) {
			pointShow.value = true
			pointX.value = x
			pointY.value = y
			materialForm.value.color = "#ffffff"
		}
	}

	/* 更新物品名称 */
	const updateMaterial = () => {
		uFormRef.value.validate().then(async valid => {
			if (valid) {
				let target = "material-add"
				let isSplic = false
				if (materialForm.value.id > 0) {
					target = "material"
					isSplic = true
				}
				// 保存到后端
				let formData = materialForm.value
				
				let left = pointX.value > 0 ? pointX.value : (formData.left > 0 ? formData.left : 0)
				let top = pointY.value > 0 ? pointY.value : (formData.top > 0 ? formData.top : 0)
				formData.coordinate = JSON.stringify({ left, top })
				formData.style = JSON.stringify({ color: materialForm.value.color })
				await requestApi(target, formData, { method: 'POST' }, isSplic).then(res => {
					// 刷新物品
					 getMaterialList()
				})
			}
			pointShow.value = false
		})

		
	}

	/* 获取区域信息 */
	const getArea = async id => {
		areaDetail.value = await requestApi('home', { id }, {}, true)

		// 设置查询条件house_id和表单 house_id
		queryParams.houseId = areaDetail.value.id
		materialForm.value.house_id = areaDetail.value.id
				
		// 设置头部标题
		uni.setNavigationBarTitle({
			title: areaDetail.value.name
		})

		// 获取物品列表
		getMaterialList()
	}

	/* 获取物品列表 */
	const getMaterialList = async () => {
		materialList.value = []
		let list = await requestApi('material-list', queryParams)

		for (let key in list) {
			// 解析自定义风格
			if (list[key].style) {
				let style = JSON.parse(list[key].style)
				for (let styleKey in style) {
					list[key][styleKey] = style[styleKey]
				}
			}

			// 解析坐标
			if (list[key].coordinate) {
				let coordinate = JSON.parse(list[key].coordinate)
				for (let coordinateKey in coordinate) {
					list[key][coordinateKey] = coordinate[coordinateKey]
				}
			}

			// 补充子级
			list[key].children = [{
					type: "number",
					name: list[key].num
				},
				{
					type: "icon",
					name: "edit-pen",
					click: "update"
				},
				{
					type: "icon",
					name: "trash",
					click: "delete"
				}
			]
		}

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

		deleteParams.value = { id: null, name: "" }
	}

	/* 物品分组功能 */
	const groupClick = (item, type) => {
		switch (type) {
			case 'update':
				editMaterial(item)
				break
			case 'delete':
				confirmDeleteMaterial(item)
				break
		}
	}

	/* 更新物品 */
	const editMaterial = item => {
		materialForm.value = item
		pointShow.value = true
	}
	
	/* 确认删除物品 */
	const confirmDeleteMaterial = item => {
		deleteParams.value.id = item.id
		deleteParams.value.name = item.name
		confirmDelete.value = true
	}

	/* 删除物品 */
	const deleteMaterial = async () => {
		if (deleteParams.value.id > 0) {
			await requestApi('material', deleteParams.value, { method: 'DELETE' }, true)
				.then(res => {
					// 刷新物品
					 getMaterialList()
				}).catch(() => {
					uni.showToast({
						title: '删除失败',
						icon: "none"
					})
				}).finally(() => {
					confirmDelete.value = false
				})
		} else {
			uni.showToast({
				title: '请选择要删除的物品',
				icon: "none"
			})
			confirmDelete.value = false
		}
	}
	
	/* 同步坐标 */
	const syncPoint = point => {
		pointX.value = point.x
		pointY.value = point.y
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
		z-index: 999;

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