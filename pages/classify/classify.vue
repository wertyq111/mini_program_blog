<template>
	<custom-nav-bar title="分类" />
	<view class="classLayout pageBg">
		<view class="classify">
			<theme-item v-for="item in classifyList" :key="item._id" :item="item" />
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { requestApi } from '@/api/apis.js';
	
	const classifyList = ref([]);
	
	// 获取专题图片
	const getClassify = async () => {
		classifyList.value = await requestApi("classify", {"pageSize": 100});
	}

	getClassify()
</script>

<style lang="scss" scoped>
	.classify {
		padding: 30rpx;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 15rpx;
		
	}
</style>

