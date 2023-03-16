<template>
	<!-- :style="navBackground" -->
    <view class="index home-bg" >
<!-- 	  <u-sticky offset-top="0" h5-nav-height="0" bg-color="transparent" :enable="enable">
		<u-navbar :border-bottom="false" :is-fixed="false" custom-class="home-bg" 
			:is-back="false">
			<view class="row logo-wrap flex1" v-show="navBg < 1 && showFixTop">
				<image :src="logo" mode="heightFix" class="logo ml30"></image>
			</view>
			<view class="flex1 row nav-search" v-show="navSearch">
				<navigator hover-class="none" @click="goPage('/pages/bundle/message_center/message_center')">
					<image class="icon-md ml30" src="/static/images/icon_news.png">
					</image>
				</navigator>
				<navigator class="ml20 flex1 mr20" hover-class="none" url="/pages/goods_search/goods_search">
					<u-search wrap-bg-color="transparent" :bg-color="'#fff'" :disabled="true" :height="62">
					</u-search>
				</navigator>
			</view>
		</u-navbar>
	  </u-sticky> -->
	  <view class="flex1 row" v-if="showFixTop">
	  	<navigator hover-class="none" @click="goPage('/pages/bundle/message_center/message_center')">
	  		<image class="icon-md ml30" src="/static/images/icon_news.png">
	  		</image>
	  	</navigator>
	  	<navigator class="ml20 flex1 mr20" hover-class="none" url="/pages/navigation/search/searchPage">
	  		<u-search wrap-bg-color="transparent" :bg-color="'#fff'" :disabled="true" :height="62" :show-action="false"></u-search>
	  	</navigator>
	  </view>
	  
	  <view class="contain">
	  	<view class="main">
			<!-- 足迹气泡 -->
	  		<!-- <bubble-tips top="50rpx" :discharge="isDischarge"></bubble-tips> -->
			<!-- 轮播图 -->
	  		<!-- <swipers :pid="1" height="322rpx" padding="20rpx 0"></swipers> -->
	  		<!-- 导航入口 -->
	  		<view class="nav bg-white" v-if="navList.length">
	  			<swiper :style="'height:' + navSwiperH + 'rpx;'" @change="swiperChange">
	  				<swiper-item v-for="(items, index) in navList" :key="index">
	  					<view class="nav-list row wrap">
	  						<view v-for="(item, index2) in items" :key="index2" @tap="tapMenu(item)"
	  							class="nav-item column-center">
	  							<image class="nav-icon" :src="toRelativeUrl(item.image)"></image>
	  							<view class="name xs">{{item.name}}</view>
	  						</view>
	  					</view>
	  				</swiper-item>
	  			</swiper>
	  			<view class="dots" v-if="navList.length > 1">
	  				<view v-for="(item, index) in navList" :key="index"
	  					:class="'dot ' + (index == currentSwiper ? 'active' : '')"></view>
	  			</view>
	  		</view>
			<!-- 资讯 -->
			<navigator v-if="news.length" class="information bg-white row mt20" hover-class="none"
				open-type="navigate" url="/pages/news_list/news_list">
				<image class="icon-toutiao" src="/static/images/icon_toutiao.png"></image>
				<text class="gap-line"></text>
				<view class="news flex1">
					<view class="shade"></view>
					<swiper autoplay="true" style="height: 76rpx; flex: 1" vertical="true" circular="true"
						:interval="3000">
						<swiper-item v-for="(item, index) in news" :key="index" class="row">
							<view class="flexnone">
								<u-tag v-if="item.is_new" shape="circle" text="最新" size="mini" type="primary"
									mode="plain" />
							</view>
							<view class="text-swiper ml10 line1">{{item.title }}</view>
						</swiper-item>
					</swiper>
				</view>
				<image class="icon-sm ml20" src="/static/images/arrow_right.png" />
			</navigator>
			
			<!-- 热销 -->
			<view class="hot mt20" v-if="hotProducts.length">
				<active-area type="hot" progressBarColor="#9912FE" :lists="hotProducts">
					<navigator slot="header" hover-class="none" class="row activity-header" open-type="navigate"
						url="/pages/bundle/hot_list/hot_list">
						<view class="title flex1">
							<image class="title-image" src="/static/images/hot_title.png"></image>
						</view>
						<view class="row xs">
							更多
							<u-icon name="arrow-right" size="28"></u-icon>
						</view>
					</navigator>
				</active-area>
			</view>
			
			<!-- 新品推荐 -->
			<view v-if="newProducts.length && showNewProducts" class="new-goods">
				<active-area type="news" progressBarColor="#9912FE" :lists="newProducts">
					<navigator slot="header" hover-class="none" class="row activity-header" open-type="navigate"
						url="">
						<view class="title flex1">
							<image class="title-image" src="/static/images/new_title.png"></image>
						</view>
					</navigator>
				</active-area>
			</view>
			
			<!-- 好物优选 -->
			<view class="goods mt20" v-if="productsList.length">
				<view class="goods-title row-center">
					<text class="line"></text>
					<view class="row">
						<image class="mr10 icon" src="/static/images/icon_like.png"></image>
						<text class="bold xxl">好物优选</text>
					</view>
					<text class="line"></text>
				</view>
				<products-list :list="productsList"></products-list>
				<loading-footer :status="status"></loading-footer>
			</view>
		</view>
	  </view>
	  
		<tabbar />
    </view>
	
</template>

<script setup lang="ts">
import { reactive,computed,ref,nextTick } from 'vue'
import {onLoad,onShow,onHide,onPageScroll } from '@dcloudio/uni-app'
import {getHotSale} from'@/api/product'
import {getDecorate} from '@/api/app'
import { JSONStringify } from 'lib/tool'
import type { Nav } from "@/models/type.js";
import {loadingFun,menuJump,arraySlice,setTabbar,getRect} from '@/utils/tools'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const isLogin = computed(() => {return userStore.isLogin})
const { VITE_APP_STATIC_URL } = import.meta.env;

let url1 = VITE_APP_STATIC_URL + 'api/uploads/image/20230315/6cf60a0d-adfd-4d83-8b46-c5c7792e390d.png'
// const navBackground = computed(() => {return 'background-image: url(http://10.15.0.61:8082/api/uploads/image/20221108/bb111f11-454a-4fb6-be4b-e6d5f003951b.png)'})
//背景图
const navBackground = computed(() => {return 'background-image: url(' + url1 + ')'})
const enable = ref<boolean>(true)
const navBg = ref<number>(0)
const showFixTop = ref<boolean>(true)
const logo = ref<string>(url1)
const navSearch = computed(() => {if(!showFixTop.value) return true})
const navList =  ref([[] as DecorateContentItme[]])//导航列表
const navSwiperH = ref<number>(374)//导航列表高度
const currentSwiper = ref<number>(0)
const news = ref<[]>([])
const hotProducts = ref<[]>([])//热销产品
const newProducts = ref<[]>([])//新品推荐
const showNewProducts = ref<boolean>(false)//新品推荐
const productsList = ref<[]>([])//好物优选


const decorate = async() => {
	let data = await getDecorate({id: 1})
	let json = JSON.parse(data.pageData)
	for (let item of json) {
        if(item.name === 'nav') {
			let content = item.content
			if(content.enabled === 1) {
				let list: Nav[] = []
				for(let d of content.data) {
					let nav: Nav = {
						image : d.image,
						link: d.link,
						name: d.name
					}
					list.push(nav)
				}
				Object.assign(navList.value[0],list)
			}
		} else if(item.name === 'newProducts') {
			showNewProducts.value = item.enabled == 1 ? true : false 
		}
    }
}

const swiperChange = (e: any) => {
	currentSwiper.value = e.detail.current
}
const tapMenu = (item: DecorateContentItme) => {
	
}

const init = async() => {
	hotProducts.value = await getHotSale()
}
const toRelativeUrl = (image: string) => {
	return VITE_APP_STATIC_URL + image
}
onShow(() => {
	// #ifdef H5
	enable.value = true
	// #endif
	decorate()
	init()
})
onHide(() => {
	// #ifdef H5
	enable.value = false
	// #endif
})
onPageScroll((e: any) => {
	const top = uni.upx2px(100)
	if(!enable.value) return
	const scrollTop = e.scrollTop
	let percent: number = scrollTop / top
	navBg.value = percent > 1 ? 1 : percent
	showFixTop.value = percent > 1 ? false : true
})
const goPage = (url: string) => {
	if (!isLogin) return toLogin()
	uni.navigateTo({
		url
	})
}
</script>

<style lang="scss">
	// #ifdef H5
	::v-deep .home-bg {
		background: url(../../static/images/bg_hometop.png) no-repeat;
		background-size: 100% auto;
	}

	// #endif
	.home-bg {
		background: url(../../static/images/bg_hometop.png) no-repeat;
		background-size: 100% auto;
	}

	.index {

		background-size: 100% auto;

		.logo-wrap {
			position: absolute;

			.logo {
				width: auto;
				height: 52rpx;
			}
		}


		.header {
			.navigation-bar {
				padding-top: var(--status-bar-height);
				box-sizing: border-box;
			}
		}

		.contain {

			.main {
				position: relative;
				z-index: 9;
				padding: 0 20rpx;

				.nav {
					position: relative;
					border-radius: 14rpx;

					.nav-item {
						width: 20%;
						margin-top: 30rpx;

						.nav-icon {
							width: 82rpx;
							height: 82rpx;
							margin-bottom: 15rpx;
						}
					}

					.dots {
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						bottom: 20rpx;
						display: flex;

						.dot {
							width: 10rpx;
							height: 6rpx;
							border-radius: 6rpx;
							margin-right: 10rpx;
							background-color: rgba(255, 44, 60, 0.4);

							&.active {
								width: 20rpx;
								background-color: $-color-primary;
							}
						}

					}

				}

				.information {
					height: 76rpx;
					box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.06);
					padding: 0 20rpx;
					box-sizing: border-box;
					border-radius: 14rpx;

					.news {
						position: relative;

						.shade {
							position: absolute;
							width: 100%;
							height: 100%;
							z-index: 100;
						}
					}

					.icon-toutiao {
						width: 114rpx;
						height: 34rpx;

					}

					.gap-line {
						height: 28rpx;
						width: 1px;
						background-color: #DCDDDC;
						margin: 0 30rpx;
					}
				}

				.special-area {
					.item {
						width: 300rpx;
						border-radius: 20rpx;
						display: inline-block;
						overflow: hidden;
						margin-right: 20rpx;

						.title {
							padding: 10rpx 0;
						}

						.desc {
							background-color: #FEE9EB;
							padding: 6rpx 20rpx;
							border-radius: 60rpx;
							max-width: 260rpx;
						}
					}

				}



				.activity-header {
					height: 90rpx;
					padding: 0 20rpx;
				}

				.seckill {
					.dec {
						background-color: #FFFBDB;
						width: 150rpx;
					}
				}

				.hot,
				.new-goods {
					.title-image {
						width: 144rpx;
						height: 55rpx;
					}
				}
			}

			.goods {
				.goods-title {
					height: 100rpx;

					.line {
						width: 58rpx;
						height: 1px;
						background-color: #ccc;
						margin: 0 22rpx;
					}

					.icon {
						width: 38rpx;
						height: 38rpx;
					}
				}
			}
		}

		.coupon-pop-container {
			background-image: url(../../static/images/home_coupon_bg.png);
			width: 638rpx;
			height: 804rpx;
			background-size: 100% 100%;
			padding-top: 323rpx;

			.coupon-pop-lists {
				.coupon-pop-item {
					background-image: url(../../static/images/pop_bg_coupon.png);
					width: 488rpx;
					height: 150rpx;
					background-size: 100% 100%;
					margin-top: 20rpx;

					.coupon-left {
						width: 160rpx;
						height: 100%;
					}

					.coupon-right {
						padding-left: 30rpx;
						border-left: 1rpx dashed $-color-primary;
					}
				}
			}
		}

		.coupons-popup {
			.wrap {
				position: relative;
				width: 638rpx;
				height: 803rpx;
				overflow: hidden;

				.coupon-bg {
					position: absolute;
					top: 0;
					width: 100%;
					height: 100%;
				}

				.item {
					position: relative;
					width: 488rpx;
					height: 150rpx;
					margin: 0 auto 20rpx;
				}

				.img {
					position: absolute;
					width: 100%;
					height: 100%;
					z-index: 0;
				}

				.item-con {
					z-index: 10;
					position: relative;
					padding: 20rpx 0;
					height: 100%;
					box-sizing: border-box;

					.price {
						width: 160rpx;
						border-right: 1px dashed $-color-primary;
						height: 100%;
					}
				}
			}

			.btn {
				width: 478rpx;
				height: 84rpx;
				margin: 20rpx auto;
				box-sizing: border-box;
				border: 3px solid #F8D07C;
			}
		}
	}
</style>
