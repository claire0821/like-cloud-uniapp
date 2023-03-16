<template>
  	<view class="user" :style="background">
		<!-- 个人信息 -->
		<view class="header" >
			<!-- #ifndef  H5 -->
			<u-sticky offset-top="0" h5-nav-height="0" bg-color="transparent">
			 <u-navbar :is-back="false" title="个人中心" :title-bold="true" :is-fixed="false" :border-bottom="false" 
			 :background="{ background: 'rgba(256,256, 256,' + navBg + ')' }" :title-color="navBg > 0.5 ? '#000' : '#fff'"></u-navbar>
			 </u-sticky>
			 <!-- #endif -->
			<view class="user-info row-between">
				<view class="info row">
					<image class="avatar mr20 flexnone" @tap="goLogin" :src="isLogin ? userInfo.avatar : '/static/images/my_portrait_empty.png'"></image>
					<view class="white" v-if="isLogin">
						<view class="name xxl line1">{{userInfo.nickname}}</view>
						<view class="user-id row-between" v-if="userInfo.sn">
							<view class="xs white ml20 mr20">会员ID: {{userInfo.sn || ''}}</view>
							<view class="xs normal copy-btn row-center ml5" @tap.stop="onCopy">复制</view>
						</view>
					</view>
					<view class="white" v-else @tap="goLogin">
						<view style="font-size: 42rpx">点击登录</view>
						<view class="sm">登录体验更多功能</view>
					</view>
				</view>
                <view class="row" style="align-self: flex-start;">
                    <view class="user-opt" style="margin-right: 30rpx;" @tap="goPage('/pages/bundle/message_center/message_center')" >
                        <view class="dot row-center" v-if="userInfo.noticeNum"></view>
                        <image style="width:58rpx;height: 58rpx;" src="/static/images/icon_my_news.png"></image>
                    </view>
                    <view class="user-opt" @tap="goPage('/pages/user_set/user_set')">
                        <image style="width:58rpx;height: 58rpx;" src="/static/images/icon_my_setting.png"></image>
                    </view>
                </view>
			</view>
			<view class="member column-end" @tap="goPage('/pages/user_vip/user_vip')">
				<view class="member-entery row-between">
					<view class="row">
						<image class="icon-md" src="/static/images/icon_member.png"></image>
						<view class="ml10">{{isLogin ? userInfo.levelName : "登录查看会员权益"}}</view>
					</view>
					<view class="row">
						<view class="sm">{{userInfo.nextLevelTips || '查看会员权益'}}</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<!-- 我的资产 -->
		<view class="my-assets bg-white">
			<view class="title row lg">我的资产</view>
			<view class="nav row">
				<view class="column-center mb20 assets-item" @tap="goPage('/pages/bundle/user_wallet/user_wallet')">
					<view class="xl primary">{{userInfo.money}}</view>
					<view class="sm">余额</view>
				</view>
				<view class="column-center mb20 assets-item" @tap="goPage('/pages/bundle/user_sign/user_sign')">
					<view class="xl primary">{{userInfo.integration}}</view>
					<view class="sm">积分</view>
				</view>
				<view class="column-center mb20 assets-item" @tap="goPage('/pages/user_coupon/user_coupon')">
					<view class="xl primary">{{userInfo.coupon}}</view>
					<view class="sm">优惠券</view>
				</view>
			</view>
		</view>
		<!-- 我的订单 -->
		<view class="order-nav bg-white">
			<view class="title row-between" @tap="goPage('/pages/user_order/user_order')">
				<view class="lg">我的订单</view>
				<view class="muted sm row">
					全部订单
					<image class="icon-sm ml10" src="/static/images/arrow_right.png"></image>
				</view>
			</view>
			<view class="nav row">
				<view class="item column-center mb20" @tap="goPage('/pages/user_order/user_order?type=pay')">
					<view class="icon-contain">
						<view v-if="userInfo.waitPay" class="badge xs row-center bg-white">
							{{userInfo.waitPay}}
						</view>
						<image class="nav-icon" src="/static/images/icon_my_payment.png"></image>
					</view>
					<view class="sm mt10">待付款</view>
				</view>
				<view class="item column-center mb20" @tap="goPage('/pages/user_order/user_order?type=delivery')">
					<view class="icon-contain">
						<view v-if="userInfo.waitDelivery" class="badge xs row-center bg-white">
							{{userInfo.waitDelivery}}
						</view>
						<image class="nav-icon mb10" src="/static/images/icon_my_fahuo.png"></image>
					</view>
					<view class="sm">待发货</view>
				</view>
				<view class="item column-center mb20" @tap="goPage('/pages/user_order/user_order?type=delivery')">
					<view class="icon-contain">
						<view v-if="userInfo.waitTake" class="badge xs row-center bg-white">
							{{userInfo.waitTake}}
						</view>
						<image class="nav-icon" src="/static/images/icon_my_shouhuo.png"></image>
					</view>
					<view class="sm mt10">待收货</view>
				</view>
				<view class="item column-center mb20" @tap="goPage('/pages/bundle/goods_comment_list/goods_comment_list')">
					<view class="icon-contain">
						<view v-if="userInfo.waitComment" class="badge xs row-center bg-white">
							{{userInfo.waitComment}}
						</view>
						<image class="nav-icon" src="/static/images/icon_my_pingjia.png"></image>
					</view>
					<view class="sm mt10">商品评价</view>
				</view>
				<view class="item column-center mb20" @tap="goPage('/pages/bundle/post_sale/post_sale')">
					<view class="icon-contain">
						<view v-if="userInfo.afterSale" class="badge xs row-center bg-white">
							{{userInfo.afterSale}}
						</view>
						<image class="nav-icon" src="/static/images/icon_my_shouhou.png"></image>
					</view>
					<view class="sm mt10">退款/售后</view>
				</view>
			</view>
		</view>
		<!-- 我的功能 -->
		<view class="server-nav bg-white" v-if="menuList && menuList.length > 0">
			<view>
				<view class="title row-between">
					<view class="lg">我的功能</view>
				</view>
			</view>
			<view class="nav row wrap">
				<button v-for="(item, index) in menuList" :key="index" class="item column-center mb20" hover-class="none"
				 :open-type="item.link_type == 3 ?'contact' :''" @tap="tapMenu(item)" style="width: 25%;">
					<image class="nav-icon" :src="item.image"></image>
					<view class="sm mt10">{{item.name}}</view>
				</button>
			</view>
		</view>
		<tabbar />
	</view>
</template>

<script setup lang="ts">
import { getDecorate } from '@/api/shop'
import { getUserDetail } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { onLoad,onShow } from '@dcloudio/uni-app'
import type { Member,DecorateContentItme } from "@/models/type.js"
import { storeToRefs } from 'pinia'
import {menuJump, copy} from '@/utils/tools'
import {toLogin,wxMnpLogin} from '@/utils/login'
import { reactive,computed,ref } from 'vue'
const userStore = useUserStore()

let url1 = 'http://10.15.0.61:8082/api/uploads/image/20221108/bb111f11-454a-4fb6-be4b-e6d5f003951b.png'
// const navBackground = computed(() => {return 'background-image: url(http://10.15.0.61:8082/api/uploads/image/20221108/bb111f11-454a-4fb6-be4b-e6d5f003951b.png)'})
//背景图
const background = computed(() => {return 'background-image: url(' + url1 + ')'})
const navBg = ref<number>(0)
const userInfo = reactive<Member>({
    id: 0,
	sn: '',
    levelId: 0,
	levelName: '',
    username: '',
	nickname: '',
	mobile: '',
	email: '',
	avatar: '',
	gender: 0,
	birth: '',
	city: '',
	job: '',
	sign: '',
	sourceType: '',
	integration: '',
	growth: '',
	nextLevelTips: '',
	noticeNum: 0,
	status: '',
})
const isLogin = computed(() => {return userStore.isLogin})
const menuList = reactive<DecorateContentItme[]>([])
onLoad((options) => {
	// setTabbar()
	// getMenuFun()
})

onShow(async () => {
	let data = await getUserDetail()
	Object.assign(userInfo,data)
	decorate()
})
// getData()

const goLogin = () => {
	
}

const onCopy = () => {
	copy(userInfo.sn)
}
//获取页面装修
const decorate = async () => {
	menuList.splice(0,menuList.length)
	let data = await getDecorate({id: 2})
	let json = JSON.parse(data.pages)
	for (let item of json) {
		if(item.name === 'my_features') {
			let content = item.content
			if(content.enabled === 1) {
				for(let d of content.data) {
					let menu: DecorateContentItme = {
						image : d.image,
						link: d.link,
						name: d.name
					}
					menuList.splice(menuList.length - 1, 0, menu)
				}
			}
		}
	}
}
const tapMenu = (item: DecorateContentItme) => {
	if(!isLogin) return toLogin()
	menuJump(item)
}
const goPage = (url: string) => {
	if(!isLogin) return toLogin()
	uni.navigateTo({
		url
	});
}
</script>

<style lang="scss">
	.user {
		background-image: url(../../static/images/my_topbg.png);
		background-size: 100% 420rpx;
		background-repeat: no-repeat;
		.header {
			display: flex;
			flex-direction: column;
			height: 420rpx;
			.user-info {
				padding: 10rpx 30rpx;
				//#ifdef  H5 
				padding-top: 90rpx;
				//#endif
				.avatar {
					height: 110rpx;
					width: 110rpx;
					border-radius: 50%;
					overflow: hidden;
				}
				.name {
					text-align: left;
					margin-bottom: 5rpx;
					max-width: 400rpx;
				}

				.user-id {
					border: 1px solid white;
					border-radius: 100rpx;
					
					.copy-btn {
						background-color: #FFDFDA;
						height: 40rpx;
						width: 90rpx;
						border-radius: 100rpx;
					}
				}

				.user-opt {
					position: relative;

					.dot {
						position: absolute;
						background-color: #ee0a24;
						border: 2rpx solid #FFFFFF;
						color: $-color-primary;
						border-radius: 100%;
						top: 6rpx;
						right: 0rpx;
						font-size: 22rpx;
						min-width: 16rpx;
						height: 16rpx;
					}
				}

				.buyer-type {
					background-color: #FFA200;
					height: 38rpx;
					padding: 0 10rpx;
				}
			}
			.member {
				flex: 1;
				padding: 0 20rpx;
				.member-entery {
					color:#FFE0A1;
					padding: 0 16rpx;
					width:100%;
					height: 80rpx;
					background: url(../../static/images/bg_member_grade.png);
					background-size: 100%;
				}
			}

		}

		.order-nav {
			.icon-contain {
				position: relative;
			}
		}

		.order-nav,
		.my-assets {
			margin: 20rpx 20rpx 0;
			border-radius: 8rpx;
		}

		.server-nav {
			margin: 20rpx;
			border-radius: 8rpx;
		}

		.title {
			height: 88rpx;
			padding: 0 30rpx;
			border-bottom: $-dashed-border;
		}

		.nav {
			padding: 26rpx 0 0;

			.assets-item {
				flex: 1;
			}

			.item {
				width: 25%;
			}

			.badge {
				padding: 0 6rpx;
				min-width: 28rpx;
				height: 28rpx;
				border-radius: 28rpx;
				box-sizing: border-box;
				border: 1rpx solid $-color-primary;
				color: $-color-primary;
				position: absolute;
				left: 33rpx;
				top: -10rpx;
				z-index: 2;
			}

			.nav-icon {
				width: 52rpx;
				height: 52rpx;
			}
		}
	}
</style>
