<template>
	<view class="searchLayout">
		<view class="search">
			<uni-search-bar 
			@confirm="onSearch"
			@cancel="onClear"
			@clear="onClear"
			focus 
			placeholder="搜索"
			v-model="queryParams.keyword">
			</uni-search-bar>
		</view>
		
		<view v-if="!materialList.length">
			<view class="history" v-if="historySearch.length">
				<view class="topTitle">
					<view class="text">最近搜索</view>
					<view class="icon" @click="removeHistory">
						<uni-icons type="trash" size="25"></uni-icons>
					</view>
				</view>
				<view class="tabs">
					<view class="tab" v-for="tab in historySearch" :key="tab" @click="clickTab(tab)">{{tab}}</view>		
				</view>
			</view>
			
			<view class="recommend">
				<view class="topTitle">
					<view class="text">热门搜索</view>				
				</view>
				<view class="tabs">				
					<view class="tab" v-for="tab in recommendList" :key="tab" @click="clickTab(tab)">{{tab}}</view>
				</view>
			</view>
		</view>
		
		
		<view class="noSearch" v-if="noSearch">
			<uv-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png"></uv-empty>
		</view>

		<template v-else>
			<view class='nav-list margin-top'>
				<navigator open-type="navigate" hover-class='none' :url="`/pages/house/materials?id=${item.houseId}`"
					:class="'nav-li bg-kuxuan' + (index+1)" v-for="(item, index) in materialList" :key="item.id">
					<view class="nav-name">{{item.name}} (数量: {{item.num}})</view>
					<view class="nav-sub-name">位置: {{item.topHouse.name}} > {{item.house.name}}</view>
				</navigator>
			</view>	
			<view v-if="noData || materialList.length"><uni-load-more :status="noData?'noMore':'loading'"/></view>
		</template>
		
		
	</view>
</template>

<script setup>
import {requestApi} from "@/api/apis.js"

//查询参数
const queryParams = ref({	
	pageNum: 1,
	pageSize: 12,
	keyword: ""
})

//搜索历史词
const historySearch = ref(uni.getStorageSync('historySearch') || []);

//热门搜索词
const recommendList = ref(["可心柔","洗碗块","洗洁精","厨房纸"]);

//没有更多
const noData = ref(false);
//没有搜索结果
const noSearch = ref(false);

//搜索结果列表
const materialList = ref([]);


//点击搜索
const onSearch = ()=>{
	historySearch.value = [...new Set([queryParams.value.keyword, ...historySearch.value])].slice(0, 10)
	uni.setStorageSync('historySearch', historySearch.value)
	initParams(queryParams.value.keyword)
	searchData()
}

//点击清除按钮
const onClear = ()=>{
	initParams()
}



//点击标签进行搜索
const clickTab = (value = '')=>{
	initParams(value)
	onSearch()
}


//点击清空搜索记录
const removeHistory = ()=>{
	uni.showModal({
		title:"是否清空历史搜索？",
		success:res=>{
			if(res.confirm){
				uni.removeStorageSync('historySearch')
				historySearch.value = []
			}
		}
	})
}

// 发送搜索请求
const searchData = async () => {
	uni.showLoading({
		title: "加载中"
	})
	let params = {
		topHouse: true,
		include: "house",
		name: queryParams.value.keyword,
		pageNum: queryParams.value.pageNum,
		pageSize: queryParams.value.pageSize
	}
	try {
		let res = await requestApi("material-index", params)
		console.log(res);
		materialList.value = [...materialList.value, ...res]
		uni.setStorageSync("storgmaterialList", materialList.value)
		if(res.length < queryParams.value.pageSize) noData.value = true
		if(res.length === 0 && materialList.value.length === 0) noSearch.value = true
	} finally {
		uni.hideLoading()
	}
}

// 初始化
const initParams = (value) => {
	materialList.value = []
	noData.value = false
	noSearch.value = false
	queryParams.value = {
		pageNum:1,
		pageSize:12,
		keyword:value || ""
	}
}

//触底加载更多
onReachBottom(()=>{
	if(noData.value) return
	queryParams.value.pageNum++
	searchData()
})

//关闭有页面
onUnload(()=>{
	uni.removeStorageSync('storgmaterialList')
})


</script>

<style lang="scss" scoped>
.searchLayout{
	.search{
		padding:0 10rpx;
	}
	.topTitle{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
		color:#999;
	}
	.history{
		padding:30rpx;		
	}
	.recommend{
		padding:30rpx;
	}
	.tabs{
		display: flex;		
		align-items: center;
		flex-wrap: wrap;
		padding-top:20rpx;
		.tab{
			background: #F4F4F4;
			font-size: 28rpx;
			color:#333;
			padding:10rpx 28rpx;
			border-radius: 50rpx;
			margin-right: 20rpx;
			margin-top: 20rpx;
		}
	}	
.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0px 40upx 0px;
		justify-content: space-between;
	}

	.nav-li {
		padding: 30upx;
		border-radius: 12upx;
		width: 45%;
		margin: 0 2.5% 40upx;
		background-image: url("https://cdn.chouy.xyz/static/NyU04x.png");
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}

	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}

	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}

	.nav-title {
		font-size: 32upx;
		font-weight: 300;
	}

	.nav-title::first-letter {
		font-size: 40upx;
		margin-right: 4upx;
	}

	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}

	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}

	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}
	
	.nav-sub-name {
		font-size: 20upx;
		text-transform: Capitalize;
		margin-top: 5upx;
		position: relative;
	}

	.nav-li text {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}

	.text-light {
		font-weight: 300;
	}
	
	/*  */
	.bg-kuxuan1 {
		background-color: #FF5656;
		color: #fff;
	}
	
	.bg-kuxuan2 {
		background-color: #6F68DF;
		color: #fff;
	}
	
	.bg-kuxuan3 {
		background-color: #9c26b0;
		color: #fff;
	}
	
	.bg-kuxuan4 {
		background-color: #0070FF;
		color: #fff;
	}
	
	.bg-kuxuan5 {
		background-color: #1cbbb4;
		color: #fff;
	}
	
	.bg-kuxuan6 {
		background-color: #BC78EC;
		color: #fff;
	}
	
	.bg-kuxuan7 {
		background-color: #f39902;
		color: #fff;
	}
	
	.bg-kuxuan8 {
		color: #fff;
		background-color: #19CF8A;
	}
	
	.bg-kuxuan9 {
		color: #fff;
		background-color: #8799a3;
	}
	
	.bg-kuxuan10 {
		color: #fff;
		background-color: #0396FF;
	}
	
	.bg-kuxuan11 {
		color: #fff;
		background-color: #BC78EC;
	}
	
	.bg-kuxuan12 {
		color: #fff;
		background-color: #FFC32E;
	}
	
	.bg-kuxuan13 {
		color: #fff;
		background-color: #a5673f;
	}
	
	.bg-kuxuan14 {
		color: #fff;
		background-color: #FF4F94;
	}
	
	.bg-kuxuan15 {
		color: #fff;
		background-color: #8DC63F;
	}
	
	.bg-kuxuan16 {
		color: #fff;
		background-color: #00c4fb;
	}
}
</style>