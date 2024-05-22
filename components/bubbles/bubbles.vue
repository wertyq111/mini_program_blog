<template>
	<view class="">
	</view>
</template>

<script setup>
	let queue = {}
	let ctx = null
	let timer = 0

	const props = defineProps({
		height: {
			type: Number,
			default: 1920
		},
		width: {
			type: Number,
			default: 375
		},
		canvasId: {
			type: String,
			default: 'bubble'
		}
	})

	/* 挂载处理 */
	onMounted(() => {
		ctx = uni.createCanvasContext(props.canvasId)
		console.log(props.canvasId + " mounted");
	})
	
	/* 销毁处理 */
	onUnmounted(() => {
		console.log(props.canvasId + ' destoryed');
		clearTimer()
	})

	/* 点赞 */
	const likeClick = () => {
		let image = "/static/images/likeFx/" + getRandomInt(1, 33) + ".png";
		let anmationData = {
			id: new Date().getTime(),
			timer: 0,
			opacity: 0,
			pathData: generatePathData(),
			image: image,
			factor: {
				// speed: 0.0009, // 运动速度，值越小越慢
				// t: 0.4//  贝塞尔函数系数，当为0，就是从无到有，这时候屏幕高度也要调一下
				speed: 0.0006, // 运动速度，值越小越慢
				t: 0.6 //  贝塞尔函数系数，当为0，就是从无到有，这时候屏幕高度也要调一下
			}
		};
		if (Object.keys(queue).length > 0) {
			queue[anmationData.id] = anmationData;
		} else {
			queue[anmationData.id] = anmationData;
			bubbleAnimate();
		}
		
		//console.log(image, queue);
	}

	/* 获取最大最小随机值 */
	const getRandom = (min, max) => {
		return Math.random() * (max - min) + min;
	}

	/* 获取最大最小之前随机值的整数 */
	const getRandomInt = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/* 获取图片路径 */
	const generatePathData = () => {
		let width = props.width,
			height = props.height;
		let p0 = {
			x: 0.72 * width,
			y: height
		};
		let p1 = {
			x: getRandom(0.22 * width, 0.33 * width),
			y: getRandom(0.5 * height, 0.75 * height)
		};
		let p2 = {
			x: getRandom(0, 0.88 * width),
			y: getRandom(0.25 * height, 0.5 * height)
		};
		let p3 = {
			x: getRandom(0, 0.88 * width),
			y: getRandom(0, 0.125 * height)
		};
		return [p0, p1, p2, p3];
	}

	/* 更新图片的最新运动路径 */
	const updatePath = (data, factor) => {
		let p0 = data[0];
		let p1 = data[1];
		let p2 = data[2];
		let p3 = data[3];

		let t = factor.t;

		/*计算多项式系数 （下同）*/
		let cx1 = 3 * (p1.x - p0.x);
		let bx1 = 3 * (p2.x - p1.x) - cx1;
		let ax1 = p3.x - p0.x - cx1 - bx1;

		let cy1 = 3 * (p1.y - p0.y);
		let by1 = 3 * (p2.y - p1.y) - cy1;
		let ay1 = p3.y - p0.y - cy1 - by1;

		let x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x;
		let y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y;

		return {
			x,
			y
		}
	}

	/* 点赞动画 */
	const bubbleAnimate = () => {
		let width = props.width,
			height = props.height;
		Object.keys(queue).forEach(key => {
			let anmationData = queue[+key];
			let {
				x,
				y
			} = updatePath(
				anmationData.pathData,
				anmationData.factor
			);
			let speed = anmationData.factor.speed;
			anmationData.factor.t += speed;

			let curWidth = 30;
			curWidth = (height - y) / 1.5;
			curWidth = Math.min(30, curWidth);

			let curAlpha = anmationData.opacity;
			curAlpha = y / (0.3 * height); //消失的高度适当调一下
			curAlpha = Math.min(1, curAlpha);
			ctx.globalAlpha = curAlpha;
			ctx.drawImage(anmationData.image, x - curWidth / 2, y, curWidth, curWidth);
	
			if (anmationData.factor.t > 1) {
				delete queue[anmationData.id];
			}
			if (y > height) {
				delete queue[anmationData.id];
			}
		});

		ctx.draw();

		if (Object.keys(queue).length > 0) {
			timer = setTimeout(() => {
				bubbleAnimate();
			}, 5);
		} else {
			clearTimer()
			ctx.draw(); // 清空画面
		}
	}

    /* 清除定时器 */
	const clearTimer = () => {
		if (timer) {
			clearTimeout(timer)
		}
	}
	
	defineExpose({likeClick})//暴露子组件的方法或者数据
</script>

<style lang="scss" scoped>
	.like-fx {
		position: fixed;
		right: 0;
		z-index: 1024;
		pointer-events: none;
		/* background-color: red; */
	}
</style>