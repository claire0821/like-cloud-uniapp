<template>
  <view class="category-wrap">
    <u-navbar class="navbar" :is-back="false">
      <div class="title"> 商品分类</div>
      <u-search class="nav-search" disabled @click="search" placeholder="搜索商品" :show-action="false"></u-search>
    </u-navbar>
    <view class="content">
      <scroll-view scroll-y scroll-with-animation class="left-aside">
        <view v-for="(item, index) in tabList" :key="item.catId" class="f-item b-b" :class="{ active: item.catId === currentId }" @click="tabtap(item, index)">
          {{ item.name }}
        </view>
      </scroll-view>
      <scroll-view scroll-with-animation scroll-y class="right-aside" :upper-threshold="-100" :lower-threshold="-100">
        <!-- 头部图片 -->
        <view class="top-img" id="main-top">
          <u-image width="500rpx" height="230rpx" @click="navigateToList(topImg.catId,topImg.catId)" :src="topImg.icon" mode="">
          </u-image>
        </view>
        <view v-for="item in categoryList" :key="item.catId" class="s-list" :id="'main-' + item.catId">
          <!-- 分类标题 -->
          <text class="s-item">{{ item.name }}</text>
          <!-- 分类详情 -->
          <view class="t-list">
            <view @click="navigateToList(item.catId, children.catId)" class="t-item" v-for="(children, cIndex) in item.children" :key="children.catId"
              :class="{ 'margin-right': (cIndex + 1) % 3 == 0 }">
              <u-image width="70px" height="70px" :src="children.icon" :lazy-load="true">
              </u-image>
              <text>{{ children.name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
	<tabbar />
  </view>
</template>

<script lang="ts" setup>
import { ref,toRaw } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCategoryList } from '@/api/category'

//左侧标题列表
const tabList = ref<any>([])
//右侧分类数据列表
const categoryList = ref<any>([])
const currentId = ref<number>(0)
//顶部图片
const topImg = ref<any>([])
//加载图片
const loadData = async () => {
	tabList.value = await getCategoryList()
	currentId.value = toRaw(tabList.value[0].catId);
	loadListContent(0);
}
//一级分类点击
const tabtap = (item: any, index: number) => {
	if (item.catId != currentId) {
	    currentId.value = item.catId;
	    loadListContent(index);
	}
}
//加载列表内容
const loadListContent = (index: number) => {
	topImg.value = tabList.value[index];
	categoryList.value = tabList.value[index].children;
}
const navigateToList = (sid: number, tid: number) => {
	uni.navigateTo({
        url: `/pages/navigation/search/searchPage?category=${tid}`,
    });
}
	
const search = () => {
	uni.navigateTo({
        url: `/pages/navigation/search/searchPage`,
    });
}
onLoad(async () => {
    loadData()
	// #ifdef MP-WEIXIN
	// 小程序默认分享
	uni.showShareMenu({ withShareTicket: true });
	// #endif
})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  background-color: #fdfaff;
}
/* 解决小程序和app滚动条的问题 */
/* #ifdef MP-WEIXIN || APP-PLUS */
::-webkit-scrollbar {
  display: none;
}
/* #endif */
/* 解决H5 的问题 */
/* #ifdef H5 */
uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
  /* 隐藏滚动条，但依旧具备可以滚动的功能 */
  display: none;
}
/* #endif */
.s-list {
  box-shadow: 0 4rpx 12rpx 0 rgba(0, 0, 0, 0.05);
}
.nav-search {
  padding-left: 30rpx !important;
  padding-right: 20rpx !important;
}
.title {
  display: block;
  width: 200rpx;
  text-align: center;
  font-size: 34rpx;
  letter-spacing: 2rpx;
  // #ifdef MP-WEIXIN
  margin-left: 26rpx;
  // #endif
}
.category-wrap {
  height: 100%;
  .content {
    height: calc(100vh - 94px);
    display: flex;
    color: #333;
    font-size: 28rpx;
    background: #fff;
  }
  .left-aside {
    flex-shrink: 0;
    width: 200rpx;
    height: 100%;
    background-color: #f7f7f7;
  }
  .f-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 97rpx;
    position: relative;
    &.active {
      font-weight: bold;
      color: #c0c4cc;
      background: #fff;
    }
  }
  .right-aside {
    flex: 1;
    overflow: hidden;
    padding: 40rpx 0 0 30rpx;
  }

  .top-img {
    width: 500rpx;
    height: 230rpx;
    border-radius: 8px;
    overflow: hidden;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .s-item {
    display: flex;
    align-items: center;
    height: 70rpx;
    padding-top: 16rpx;
    font-weight: 500;
  }
  .t-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding-top: 12rpx;
  }
  .margin-right {
    margin-right: 0 !important;
  }
  .t-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 150rpx;
    margin-right: 25rpx;
    font-size: 24rpx;
    padding-bottom: 20rpx;
    image {
      width: 140rpx;
      height: 140rpx;
      border-radius: 8px;
      margin-bottom: 20rpx;
    }
    ::v-deep .u-image {
      width: 140rpx !important;
      height: 140rpx !important;
      border-radius: 8px !important;
      margin-bottom: 20rpx !important;
    }
  }
}
</style>
