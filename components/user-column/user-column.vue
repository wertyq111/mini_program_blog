<template>
	<navigator v-if="isUrl" :url="url" class="row">
		<view class="left">
			<uni-icons :type="iconConfig.left.type" :size="iconConfig.left.size" />
			<view class="text">{{textConfig.left}}</view>
		</view>
		<view class="right">
			<view class="text">{{textConfig.right}}</view>
			<uni-icons :type="iconConfig.right.type" :size="iconConfig.right.size" />
		</view>
		<slot name="custom" class="custom"></slot>
	</navigator>
	<view v-else class="row">
		<view class="left">
			<uni-icons :type="iconConfig.left.type" :size="iconConfig.left.size" />
			<view class="text">{{textConfig.left}}</view>
		</view>
		<view class="right">
			<view class="text">{{textConfig.right}}</view>
			<uni-icons :type="iconConfig.right.type" :size="iconConfig.right.size" />
		</view>
		<slot name="custom" class="custom"></slot>
	</view>
</template>

<script>
	export default {
		options: {
			styleIsolation: 'shared', // 解除样式隔离
		},
	}
</script>
<script setup>
	defineProps({
		isUrl: {
			type: Boolean,
			default: false
		},
		url: {
			type: String,
			default: ""
		},
		iconConfig: {
			type: Object,
			default: {
				left: {
					type: "",
					size: 0,
					color: ""
				},
				right: {
					type: "",
					size: 0,
					color: ""
				}
			}
		},
		textConfig: {
			type: Object,
			default: {
				left: "",
				right: ""
			}
		}
	})
</script>

<style lang="scss" scoped>
	.row {
		display: flex;
		justify-content: space-between;
		padding: 0 30rpx;
		height: 100rpx;
		border-bottom: 1px solid #eee;
		position: relative;
		background: #fff;

		&:last-child {
			border-bottom: 0;
		}

		.left {
			display: flex;
			align-items: center;

			.text {
				padding-left: 20rpx;
				color: #666;
			}

			::v-deep .uni-icons {
				color: $brand-theme-color !important;
			}

		}

		.right {
			display: flex;
			align-items: center;

			::v-deep .uni-icons {
				color: $text-font-color-2 !important;
			}

			.text {
				padding-right: 20rpx;
				color: #aaa;
			}
		}
	}
</style>