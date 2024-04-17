import { request } from "@/utils/request.js"
const API_LIST = {
	homeBanner: '/bizhi/homeBanner',  // 首页轮播图片
	wallNewsList: '/bizhi/wallNewsList', // 首页公告
	randomWall: 'login:/wallpaper/random', // 首页每日推荐
	classify: 'login:/wallpaper-classify/list', // 首页专题 / 分类
	wallNewsDetail: '/bizhi/wallNewsDetail', // 公告详情
	wallList: 'login:/wallpaper/index', // 专题图片列表
	setupScore: 'login:/wallpaper/score', //图片预览评分
	detailWall: 'login:/wallpaper/info', //单张壁纸预览
	downloadWall: 'login:/wallpaper/download', // 图片下载写入
	userWallList: 'login:/wallpaper/user', // 个人中心 - 我的评分/下载列表
	memberInfo: 'login:/members/user', // 个人中心
	searchWall: '/bizhi/searchWall', //搜索壁纸
	login: 'login:/easywechat/mini_program/authorizations', //登录
	getUserInfo: 'login:/users/getUserInfo', //获取用户信息
	getQiniuToken: 'login:/qiniu/up-token', //获取七牛云token
	addWallPagerClassify: 'login:/wallpaper-classify/add', //添加壁纸分类
	addWallPager: 'login:/wallpaper/add', //添加壁纸
	editMember: 'login:/members', //编辑会员信息
}

export function requestApi(target, data = {}, config = {}, isSplic = false) {
	let url = API_LIST[target]
	if(isSplic === true) {
		url = url + "/" + (data.id || null)
	}
	return request(url, data, config)
}