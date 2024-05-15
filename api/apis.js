import { request } from "@/utils/request.js"
const API_LIST = {
	homeBanner: '/bizhi/homeBanner',  // 首页轮播图片
	wallNewsList: '/bizhi/wallNewsList', // 首页公告
	randomWall: '/wallpaper/random', // 首页每日推荐
	classify: '/wallpaper-classify/list', // 首页专题 / 分类
	wallNewsDetail: '/bizhi/wallNewsDetail', // 公告详情
	wallList: '/wallpaper/index', // 专题图片列表
	setupScore: '/wallpaper/score', //图片预览评分
	detailWall: '/wallpaper/info', //单张壁纸预览
	downloadWall: '/wallpaper/download', // 图片下载写入
	userWallList: '/wallpaper/user-list', // 个人中心 - 我的评分/下载列表
	memberInfo: '/members/user', // 个人中心
	searchWall: '/bizhi/searchWall', //搜索壁纸
	login: '/easywechat/mini_program/authorizations', //登录
	getUserInfo: '/users/getUserInfo', //获取用户信息
	getQiniuToken: '/qiniu/up-token', //获取七牛云token
	addWallPagerClassify: '/wallpaper-classify/add', //添加壁纸分类
	addWallPager: '/wallpaper/add', //添加壁纸
	editMember: '/members', //编辑会员信息
	notebookList: '/articles/index', // 文章列表
	notebookDetail: '/articles/show', // 文章列表
	notebookGood: '/articles/good', // 文章点赞
}

export function requestApi(target, data = {}, config = {}, isSplic = false) {
	let url = API_LIST[target]
	if(isSplic === true) {
		url = url + "/" + (data.id || null)
	}
	return request(url, data, config)
}
