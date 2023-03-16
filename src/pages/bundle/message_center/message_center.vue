<template>
<view class="message-center-container">
  <navigator v-for="(item, index) in list" :key="index" class="message-item row" hover-class="none" :url="'/pages/bundle/notice/notice?type=' + item.type">
    <image style="width: 76rpx;height: 76rpx;flex: none" :src="item.img"></image>
    <view class="item-info ml20 column">
      <view class="item-title">{{item.title}}</view>
      <view class="item-desc line1 muted">{{item.content}}</view>
    </view>
  </navigator>
</view>
</template>

<script lang="ts" setup>
import { reactive,computed,ref,nextTick } from 'vue'
import {onShow } from '@dcloudio/uni-app'
import {getListNotice} from '@/api/notice'
import type { NoticeRecordList } from "@/models/type.js"
const list = reactive<NoticeRecordList[]>([])

const getListNoticeFun = async()  => {
	let data = await getListNotice()
	Object.assign(list,data)
}
onShow(() => {
	getListNoticeFun()
})
</script>

<style lang="scss">
.message-center-container {
  margin-top: 10rpx;
  padding: 0 20rpx;
  background-color: white;
  .message-item {
    padding: 32rpx 0;
    &:not(:last-of-type) {
        border-bottom: $-solid-border;
    }
    .item-info {
      font-size: 32rpx;
      flex: 1;
      overflow: hidden;
      .item-title{
        font-size: 32rpx;
      }
      .item-desc{
        font-size: 26rpx;
      }
    }
  }
}
</style>