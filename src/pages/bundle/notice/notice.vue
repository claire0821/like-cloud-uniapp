<template>
	<view class="notice-container">
		<z-paging
		    ref="paging"
		    v-model="dataList"
		    @query="queryList"
		    :fixed="false"
		    height="100%"
		>
		    <view class="notice-item mb20" v-for="(noticeItem, noticeIndex) in dataList" :key="noticeIndex">
		        <view class="row-between item-header">
		          <view class="header-title md">{{noticeItem.title}}</view>
		          <view class="header-time muted xs">{{noticeItem.createTime}}</view>
		        </view>
		        <view class="item-main">
		          <view class="content sm lighter">{{noticeItem.content}}</view>
		        </view>
		    </view>
		</z-paging>
	</view>
</template>

<script lang="ts" setup>
import { reactive,ref,shallowRef } from 'vue'
import {onLoad } from '@dcloudio/uni-app'
import {getListNoticeByType} from '@/api/notice'
import type { NoticeRecord } from "@/models/type.js"
import { LoadTypeEnum} from '@/enums/appEnums'
let type: number

const paging = ref<any>(null)
const dataList = ref<NoticeRecord[]>([])
const isFirst = ref<boolean>(true)
const queryList = async (pageNo: number, pageSize: number) => {
    try {
        let data = await getListNoticeByType({
            type: type,
            pageNo,
            pageSize
        })
        paging.value.complete(data.lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}

onLoad((options: any) => {
	if(options.type) {
		type = parseInt(options.type) 
		switch (type) {
			case 1:
				uni.setNavigationBarTitle({
				  title: '系统通知'
				})
				break
			case 2:
				uni.setNavigationBarTitle({
					title: '收益通知'
				})
				break
		}
		paging.value?.reload()
	}
	
})
</script>

<style lang="scss">
	.notice-container {
		  height: calc(100vh);
		  padding: 0 20rpx;
		  margin-top: 8rpx;
		  .notice-item {
		    background-color: white;
		    padding: 0rpx 20rpx 30rpx;
		    border-radius: 10rpx;
		    .item-header {
		      padding: 19rpx 0;
		      border-bottom: $-solid-border;
		      .header-title {
		        font-weight: bold;
		      }
		    }
		    .item-main {
		        .content {
		          margin-top: 15rpx;
		        }
		    }
		  }
		  .data-null {
		    padding-top: 100rpx;
		  }
		}
</style>