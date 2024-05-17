<template>
    <custom-nav-bar title="文章资讯"/>
    <view class="notebookLayout pageBg">
        <view class="cu-card article no-card">
            <view class="page-box" v-if="notebookList.length < 1">
                <view>
                    <view class="centre">
                        <image src="https://cdn.zhoukaiwen.com/noData1.png" mode="widthFix"></image>
                        <view class="explain">
                            暂无数据
                            <view class="tips">可以去看看有其他</view>
                        </view>
                        <!-- <view class="btn">随便逛逛</view> -->
                    </view>
                </view>
            </view>
            <view v-else class="cu-item shadow borderBottom" v-for="(item, index) in notebookList" :key="index"
                  @click="goNews(item.id)">
                <view class="title">
                    <view class="text-cut text-bold text-lg">{{ item.title }}</view>
                </view>
                <view class="content">
                    <image :src="item.cover" mode="aspectFit"></image>
                    <view class="desc">
                        <view class="text-content">{{ item.content.replace(/<[^>]+>/g, "") }}</view>
                        <view class="margin-top-xs"
                              style="display: flex;align-items:center;justify-content: space-between;">
                            <view class="text-gray light sm text-df round fl">
                                <uni-dateformat :date="item.createTimestamp * 1000" format="yyyy-MM-dd"/>
                            </view>
                            <view>
                                <view class="text-gray light sm round margin-lr-xs"
                                      style="display: inline-flex;align-items:center;">
                                    <uni-icons type="eye-filled" size="20"></uni-icons>
                                    <text class="text-df" style="margin-top: 2rpx;">{{ item.viewCount }}</text>
                                </view>
                                <view class="text-gray light sm round margin-lr-xs"
                                      style="display: inline-flex;align-items:center;">
                                    <uni-icons type="hand-up-filled" size="20"></uni-icons>
                                    <text class="text-df" style="margin-top: 2rpx;">{{ item.likeCount }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="loadinglayout" v-if="notebookList.length">
                <uni-load-more :status="noData ? 'noMore' : 'loading'"/>
            </view>
        </view>
    </view>
</template>

<script setup>
import {requestApi} from '@/api/apis.js'

const notebookList = ref([]);
const noData = ref(false)

const queryParams = {
    page: 1,
    perPage: 12
}

uni.setEnable

// 触底触发事件
onReachBottom(() => {
    if (noData.value) return
    queryParams.page++
    getNotebookList()
})

const getNotebookList = async () => {
    let res = await requestApi('notebookList', queryParams);

    if (queryParams.perPage > res.length) noData.value = true

    notebookList.value = [...notebookList.value, ...res]
    uni.stopPullDownRefresh()
}

// 下拉刷新
onPullDownRefresh(() => {
    notebookList.value = []
    getNotebookList()
})

const goNews = (id) => {
    uni.navigateTo({
        url: '/pages/notice/detail?id=' + id,
    })
}

getNotebookList()


</script>

<style lang="scss" scoped>
.borderBottom {
  border-bottom: 1px solid #f2f2f2;
}

// 暂无数据
.centre {
  text-align: center;
  margin: 200 rpx auto;
  font-size: 32 rpx;

  image {
    width: 300 rpx;
    border-radius: 50%;
    margin: 0 auto;
  }

  .tips {
    font-size: 24 rpx;
    color: #999999;
    margin-top: 20 rpx;
  }

  .btn {
    margin: 80 rpx auto;
    width: 200 rpx;
    border-radius: 32 rpx;
    line-height: 64 rpx;
    color: #ffffff;
    font-size: 26 rpx;
    background: linear-gradient(270deg, #1cbbb4 0%, #0081ff 100%);
  }
}

.nav .cu-item.cur {
  font-weight: 600;
}
</style>

