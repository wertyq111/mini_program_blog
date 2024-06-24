# lime-color-picker 颜色选择器
- 基于uniapp vue3 实现的颜色选择器，目前为初版，仅在H5和微信小程序测试过
- 选择器不包含弹窗，如果需要弹窗请自行使用第三方弹窗

### 注意
- 如果你放在弹窗里，请在弹出后再展示`v-if`选择器，因为选择器需要获取节点尺寸

## 使用
- 导入插件后直接使用
- 颜色编码格式，支持 `HEX`、`HSB`、`RGB`。
```html
<l-color-picker v-model="color"></l-color-picker>
```
```js
const color = ref('#FA8C16')
```
### 受控模式

```html
<l-color-picker value="#FA8C16" @change="change"></l-color-picker>
```
```js
// color 为 Color 实例，更多转换方法请看文档最后`Color`表格
const change = (color) => {
	const hex = color.toHexString()
	const rgb = color.toRgbString()
	const hsb = color.toHsbString()
}
```

### 预设颜色

```html
<l-color-picker :presets="presets"></l-color-picker>
```
```js
const presets = [{
	label: 'Recommended',
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
},
{
	label: 'Recent',
	colors: [],
}]
```


### 查看示例
导入后直接使用这个标签查看演示效果，
```html
// 代码位于 uni_modules/lime-color-picker/compoents/lime-color-picker
<lime-color-picker />
```


### 插件标签
- 默认 l-color-picker 为 component
- 默认 lime-color-picker 为 demo

## API

### Props

| 参数                       | 说明                                                         | 类型             | 默认值       |
| --------------------------| ------------------------------------------------------------ | ---------------- | ------------ |
| value(v-model)            | 颜色的值                                                    | <em>string</em>  | `-`        |
| defaultValue              | 颜色的值                                                       | <em>string</em>  | `-`        |
| presets                   | 预设的颜色                                                     | <em>{ label: string, colors: Array<string> }[]</em>  | `-`     |
| disabled           		| 禁用颜色选择器                                                  | <em>boolean</em>  | `-`      |

### Color
| 参数                       | 说明                                                         | 类型             | 
| --------------------------| ------------------------------------------------------------ | ---------------- | 
| toHex                     | 转换成 `hex` 格式字符                                         | <em>() => string</em>  |
| toHexString               | 转换成 `hex` 格式颜色字符串                                    | <em>() => string</em>  |
| toHsb                     | 转换成 `hsb` 对象                                             | <em>() => ({ h: number, s: number, b: number, a number })</em>  |
| toHsbString           	 | 转换成 `hsb` 格式颜色字符串                                   | <em>() => string</em>  |
| toRgb           		     | 转换成 `rgb` 对象                                             | <em>() => ({ r: number, g: number, b: number, a number })</em>  |
| toRgbString                | 转换成 `rgb` 格式颜色字符串                                    | <em>() => string</em>  |



## 打赏

如果你觉得本插件，解决了你的问题，赠人玫瑰，手留余香。  
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png)
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png)