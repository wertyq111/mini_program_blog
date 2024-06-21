# liu-rotating-menu适用于uni-app项目的可拖动悬浮菜单组件
### 本组件目前兼容微信小程序、H5
### 本组件是可拖动悬浮菜单，兼容小程序、H5，支持自动停靠，支持自定义样式，源码简单易修改
# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！ 

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 使用示例	
``` 
<template>
	<view>
		<liu-rotating-menu :btnObj="btnObj" @click="click"></liu-rotating-menu>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				btnObj: {
					id: '1',
					name: '菜单',
					childs: [{
						id: '1',
						name: '菜单一'
					}, {
						id: '2',
						name: '菜单二'
					}, {
						id: '3',
						name: '菜单三'
					}]
				}
			};
		},
		methods: {
			//点击菜单
			click(e) {
				console.log('所点击菜单信息：', e)
			},
		},
	};
</script>
```

### 属性说明
| 名称                         | 类型            | 默认值                | 描述             |
| ----------------------------|--------------- | ------------------ | ---------------|
| btnObj                      | Object         | {}                 | 菜单数据源
| disabled                    | Boolean        | false              | 是否禁用拖动
| bottomPx                    | Number         | 30                 | 按钮默认位置离底部距离（px）
| rightPx                     | Number         | 0                  | 按钮默认位置离右边距离（px）
| @click                      | function       |                    | 点击菜单回调事件
