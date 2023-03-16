<template>
  <div class="main-page">
    <!-- #ifdef APP-PLUS -->
    <view class="status_bar"></view>
    <!-- #endif -->
    <!-- 仅h5有效 打开App -->
	<!-- 分享 -->
<!-- 	:thumbnail="productDetail.thumbnail"
	:productName="productDetail.productName" -->
   <!-- <share
      v-if="enableShare && skuId"
      :skuId="skuId"
      :link="
        '/pages/product/product?skuId=' +
        skuId"
     
      type="goods"
      @close="enableShare = false"
    /> -->

	<!-- <popup
      v-model="popupsSwitch"
      @tapPopup="handleNavbarList"
      :popData="navbarListData"
      :x="navbarListX"
      :y="navbarListY"
      placement="top-start"
    /> -->
	
    <view class="index">
      <!-- topBar -->
      <u-navbar
        :background="fff"
        :is-back="false"
        :class="headerFlag ? 'header' : 'header bg-none scroll-hide'"
      >
        <div class="headerRow">
          <div class="backs">
            <u-icon @click="back()" name="arrow-left" class="icon-back"></u-icon>

            <u-icon
              name="list"
              @click="popupsSwitch = !popupsSwitch"
              class="icon-list"
            ></u-icon>
          </div>
          <div class="headerList" :class="headerFlag ? 'tab-bar' : 'tab-bar scroll-hide'">
            <div class="headerRow">
              <div
                class="nav-item"
                v-for="header in headerList"
                :key="header.id"
                :class="{ cur: scrollId === header.id }"
                @click="headerTab(header.id)"
              >
                {{ header.text }}
              </div>
            </div>
          </div>
        </div>
      </u-navbar>

      <u-navbar
        :border-bottom="false"
        v-show="!headerFlag"
        class="header-only-back"
        :background="navbarOnlyBack"
        :is-back="false"
      >
        <div>
          <div class="bg-back">
            <u-icon
              size="40"
              @click="back()"
              name="arrow-left"
              class="icon-back"
            ></u-icon>
            <u-icon
              size="40"
              @click="popupsSwitch = !popupsSwitch"
              name="list"
              class="icon-list"
            ></u-icon>
          </div>
        </div>
      </u-navbar>
    </view>
    
	<view
      class="product-container"
      :style="{ height: productRefHeight }"
      ref="productRef"
      id="productRef"
    >
      <scroll-view
        scroll-anchoring
        enableBackToTop="true"
        scroll-with-animation
        scroll-y
        class="scroll-page"
        :scroll-top="tabScrollTop"
        @scroll="pageScroll"
      >
        <view>
          <!-- 轮播图 -->
          <swiper id="main1" :res="productDetail.images" />

          <!-- 促销活动条 -->
        <!--  <PromotionAssembleLayout
            v-if="PromotionList"
            :detail="productDetail"
            :res="PromotionList"
          /> -->

          <view class="card-box top-radius-0" id="main2">
          
          
            <view class="-goods-msg">
              <!-- 没有拼团，秒杀等活动的情况下 -->
              <view>
                <view class="-goods-flex">
            

                  <view class="icons share" @click="shareChange()">
                    <u-icon size="30" name="share-fill"></u-icon>
                    <view>分享</view>
                  </view>
                  <view class="icons" @click="clickFavorite(productDetail.info.skuId)">
                    <u-icon
                      size="30"
                      :color="favorite ? '#f2270c' : '#262626'"
                      :name="favorite ? 'heart-fill' : 'heart'"
                    ></u-icon>
                    <view :style="{ color: favorite ? '#f2270c' : '#262626' }">{{
                      favorite ? "已收藏" : "收藏"
                    }}</view>
                  </view>
                </view>
				<!-- 商品sku标题和描述 -->
                <view class="-goods-name desc-bold">
                  {{ productDetail.info.skuName || "" }}
                </view>
                <view class="-goods-desc">
                  {{ productDetail.info.skuDesc || "" }}
                </view>
              </view>
            </view>
          </view>

    
        </view>
      </scroll-view>


    </view>
  
  </div>
</template>
<script lang="ts" setup>
import { ref,reactive,onMounted } from 'vue'
import { onLoad,onShow } from '@dcloudio/uni-app'
import {getProductDetail} from '@/api/product'
import {ProductTypeEnum} from '@/enums/appEnums'
// import share from "@/components/widgets/share/share"; //分享
// import popup from "@/components/widgets/popup/popup"; //气泡框
import swiper from "./swiper"; //轮播图组件

const navbarListData = [
    //导航栏列表栏数据
    {
      title: "首页",
      icon: "home-fill",
      ___type: "other",
    },
    {
      title: "购物车",
      icon: "bag-fill",
      ___type: "other",
    },
    {
      title: "搜索",
      icon: "search",
      ___type: "category",
    },
    {
      title: "个人中心",
      icon: "account-fill",
      ___type: "other",
    }
]
let navbarListX: number;//导航栏列表栏x轴
let navbarListY: number;//导航栏列表栏y轴
// #ifdef H5
navbarListX = 110 
navbarListY = 80 
// #endif
// #ifdef MP-WEIXIN
navbarListX= 100 //导航栏列表栏x轴
navbarListY= 140 //导航栏列表栏y轴
// #endif
 // #ifdef APP-PLUS
navbarListX= 120 //导航栏列表栏x轴
navbarListY= 170 //导航栏列表栏y轴
// #endif
const headerList = [
    //顶部导航文字按照规则来 详情全局搜索
    {
      text: "商品",
      id: 1
    },
    {
      text: "评价",
      id: 2
    },
    {
      text: "详情",
      id: 3
    },
    {
      text: "推荐",
      id: 4
    }
]
const enableShare = ref<boolean>(false)//分享
const skuId = ref<number|any>(null)//商品id，路由跳转
const popupsSwitch = ref<boolean>(false)//导航栏列表栏开关
// const productDetail = ref<any>()//商品数据
let productDetail = reactive({
    type: ProductTypeEnum.MATERIAL, //商品类型
	images: [],//图片
	points: 0,
	info: {
		skuId: -1,
		spuId: -1,
		skuName: '',
		skuDesc: '',
		skuTitle: '',
		skuSubtitle: '',
		price: '',
		saleCount: ''
	}
})
const headerFlag = ref<boolean>(false)//顶部导航显示与否
const scrollFlag = ref<boolean>(false)
let tabScrollTop = false
const scrollId = ref<number>(1)//顶部导航文字当前id
let scrollArr: any[]= []
const favorite = ref<boolean>(false)//收藏与否flag
onLoad((option) => {
	skuId.value = option.skuId
	//init()
})
//返回
const back = () => {
	if (getCurrentPages().length == 1) {
        uni.switchTab({
          url: "/pages/tabbar/home/index",
        });
    } else {
		uni.navigateBack();
    }
}
const shareChange = () => {
	
}
const clickFavorite = (skuId: number) => {
	
}
//顶部header显示或隐藏
const pageScroll = (e: any) => {
	if(scrollFlag) {
		//calcSize()
	}
	if (e.detail.scrollTop > 200) {
	  //当距离大于200时显示回到顶部按钮
	  headerFlag.value = true;
	} else {
	  //当距离小于200时隐藏回到顶部按钮
	  headerFlag.value = false;
	}
	if (e.detail.scrollTop < scrollArr[0] - 10) {
	  scrollId.value = 1;
	}
	if (e.detail.scrollTop > scrollArr[1] - 10) {
	  scrollId.value = 2;
	}
	if (e.detail.scrollTop > scrollArr[2] - 10) {
	  scrollId.value = 3;
	}
	if (e.detail.scrollTop > scrollArr[3] - 10) {
	  scrollId.value = 4;
	}
}
//初始化信息
const init = async () => {
	productDetail = await getProductDetail(skuId.value);
	productDetail.type = ProductTypeEnum.MATERIAL
	console.log(productDetail)
}

onShow(() => {
	init()
})
</script>

<style lang="scss" scoped>
// #ifdef MP-WEIXIN
@import "./mp-products.scss";
// #endif

@import "./style.scss";
@import "./product.scss";
</style>
