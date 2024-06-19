<template>
	<view @click="getMouseXY">
		<up-image :src="'https://cdn.chouy.xyz/login/logo.png'" width="100wh" height="100vh"
			mode="aspectFill"></up-image>
		<view class="anchor-point">
			<up-input v-if="pointShow" v-model="pointItem" placeholder="请输入物品名" :focus="true"
				@blur="updateItem" :customStyle="{position:'absolute', top: pointY + 'px', left: pointX + 'px'}"
				prefixIcon="map-fill" prefixIconStyle="color: #909399" clearable></up-input>
		</view>

		<template v-if="items.length > 0">
			<view class="item" v-for="item in items" :key="item.id" :style="{top: item.top + 'px', left: item.left + 'px'}">
				<up-avatar :text="item.name" fontSize="10" randomBgColor></up-avatar>
				<text>{{item.num}}</text>
			</view>
		</template>
	</view>
</template>

<script setup>
	const pointX = ref(0)
	const pointY = ref(0)
	const pointShow = ref(false)
	const pointItem = ref("")
	const items = ref([])


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
	const updateItem = () => {
		if (pointItem.value) {
			items.value.push({
				id: items.value.length,
				name: pointItem.value,
				left: pointX.value,
				top: pointY.value,
				num: 0
			})
		}
		pointShow.value = false
		console.log(items.value);
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
</style>