<template>
	<view>
		<view class="order-details">
			<view class="header-bg"></view>
				<view class="main">
					<!-- 订单状态 -->
					<view class="header">
						<view class="item" v-if="orderDetail.status === OrderStatusEnum.CREATE_NEW">
							<view class="white lg mb10">等待买家付款</view>
							<view class="white sm row" v-if="cancelTime > 0">支付剩余 <u-count-down separator="zh" :show-hours="false"
								 :show-seconds="false" :timestamp="cancelTime" separator-color="#fff" color="#fff" :separator-size="26"
								 :font-size="26" bg-color="transparent"></u-count-down> 自动关闭</view>
						</view>
						<view class="item" v-else-if="orderDetail.status === OrderStatusEnum.PAYED">
							<view class="white lg mb10">等待商家发货</view>
							<view class="white sm">您的商品正在打包中，请耐心等待…</view>
						</view>
						<view class="item" v-else-if="orderDetail.status === OrderStatusEnum.SENDED">
							<view class="white lg mb10">已发货</view>
							<view class="white sm">您的商品正在路中，请耐心等待…</view>
						</view>
						<view class="item" v-else-if="orderDetail.status === OrderStatusEnum.RECIEVED">
							<view class="white lg mb10">已完成</view>
							<view class="white sm">商品已签收，期待再次购买！</view>
						</view>
						<view class="item" v-else-if="orderDetail.status === OrderStatusEnum.CANCLED">
							<view class="white lg mb10">订单已关闭</view>
							<!-- <view class="white sm">原因：超时未支付</view> -->
						</view>
					</view>
					<!-- 地址 -->
					<view class="address-wrap row contain">
						<image class="icon-md mr20" src="/static/images/icon_address.png"></image>
						<view class="address">
							<view>
								<text class="name md mr10">{{orderDetail.address.name}}</text>
								<text class="phone md">{{orderDetail.address.phone}}</text>
								<view class="area sm mt10 lighter">{{orderDetail.address.provinceCityRegion + orderDetail.address.detailAddress}}</view>
							</view>
						</view>
					</view>
					<!-- 商品信息 -->
					<view class="goods contain">
						<!-- <view class="status row-between" v-if="team.status != null">
							<view>拼团状态</view>
							<view :style="'padding: 6rpx 26rpx; ' + (team.status == 2 && 'background-color: #d7d7d7')" class="bg-primary br60 white sm">
								{{teamStatus(team.status)}}
							</view>
						</view> -->
						<!-- :team="team" -->
						<order-products :link="true" :list="orderDetail.cartItems"></order-products>
					</view>
					<!-- 金额计算 -->
					<view class="price contain">
						<view class="row-between">
							<view>商品金额</view>
							<view class="black">
								<price-format :price="orderDetail.totalAmount"></price-format>
							</view>
						</view>
						<view class="row-between">
							<view>运费</view>
							<view class="black">+
								<price-format :price="orderDetail.freightAmount"></price-format>
							</view>
						</view>
						<view v-if="orderDetail.couponAmount != 0" class="row-between">
							<view>优惠券</view>
							<view class="primary">-
								<price-format :price="orderDetail.couponAmount"></price-format>
							</view>
						</view>
						<view v-if="orderDetail.integrationAmount != 0" class="row-between">
							<view>积分抵扣</view>
							<view class="primary">-
								<price-format :price="orderDetail.integrationAmount"></price-format>
							</view>
						</view>
						<view class="row-end">
							<view class="lighter">实付金额：</view>
							<view class="primary xl">
								<price-format :first-size="34" :second-size="34" :price="orderDetail.payAmount"></price-format>
							</view>
						</view>
					</view>
					<!-- 买家留言 -->
					<view class="order-info contain">
						<view class="item row" style="align-items: flex-start;">
							<view class="title">买家留言</view>
							<view class="black">{{orderDetail.note || '无'}}</view>
						</view>
					</view>
					<!-- 订单信息 -->
					<view class="order-info contain">
						<view class="item row">
							<view class="title">订单编号</view>
							<view class="black">{{orderDetail.orderSn}}</view>
						</view>
						<view class="item row">
							<view class="title">订单类型</view>
							<view class="black">{{orderDetail.strType}}</view>
						</view>
						<view class="item row">
							<view class="title">支付方式</view>
							<view class="black">{{orderDetail.strPayType}}</view>
						</view>
						<view class="item row">
							<view class="title">下单时间</view>
							<view class="black">{{orderDetail.createTime}}</view>
						</view>
						<view v-if="orderDetail.paymentTime" class="item row">
							<view class="title">付款时间</view>
							<view class="black">{{orderDetail.paymentTime}}</view>
						</view>
						<view v-if="orderDetail.deliveryTime" class="item row">
							<view class="title">发货时间</view>
							<view class="black">{{orderDetail.deliveryTime }}</view>
						</view>
						<view v-if="orderDetail.receiveTime" class="item row">
							<view class="title">收货时间</view>
							<view class="black">{{orderDetail.receiveTime }}</view>
						</view>
						<view v-if="orderDetail.cancel_time" class="item row">
							<view class="title">关闭时间</view>
							<view class="black">{{orderDetail.cancel_time}}</view>
						</view>
					</view>
				</view>	
		</view>
	</view>
</template>

<script lang="ts" setup> 
import {ref,reactive,onMounted,computed,nextTick,shallowRef} from 'vue'
import {OrderStatusEnum} from '@/enums/appEnums'
import {getOrderdDetail} from '@/api/order'
import {onLoad,onShow} from '@dcloudio/uni-app'

const orderDetail = reactive<Order>({
	member: {
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
		sourceType: 0,
		integration: 0,
		growth: 0,
		nextLevelTips: '',
		noticeNum: 0,
		waitPay: 0,
		waitDelivery: 0,
		waitTake: 0,
		waitComment: 0,
		afterSale: 0,
		status: 0,
	},
	address: {
		id: 0,
		memberId: 0,
		name: '',
		phone: '',
		postCode: '',
		province: '',
		city: '',
		region: '',
		detailAddress: '',
		areacode: '',
		provinceCityRegion: '',
		defaultStatus: 0,
	},
	cartItems: [],
	productCount: 0,
	note: '',
	totalAmount: 0,
	payAmount: 0,
	freightAmount: 0,
	promotionAmount: 0,
	integrationAmount: 0,
	couponAmount: 0,
	discountAmount: 0,
	integralUse: false,
	status: 0,
})
const cancelTime = ref<number>(0)//剩余支付时间
const getOrderDetailFun = async (orderSn: string) =>{
	let data = await getOrderdDetail(orderSn)
	Object.assign(orderDetail,data)
}

onLoad((options) => {
	let sn = options.sn;
	getOrderDetailFun(sn)
})


</script>

<style lang="scss">
	.order-details {
		position: relative;
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
	}

	.order-details .header-bg {
		position: absolute;
		top: 0;
		width: 100%;
		height: 200rpx;
		background-color: $-color-primary;
		z-index: 0;
	}

	.order-details .goods .status {
		height: 88rpx;
		padding: 0 20rpx;
	}

	.order-details .main {
		position: relative;
		z-index: 1;
	}

	.order-details .contain {
		margin: 0 20rpx 20rpx;
		border-radius: 14rpx;
		background-color: #fff;
	}

	.order-details .header {
		padding: 24rpx 40rpx;
		box-sizing: border-box;
	}

	.order-details .img-line {
		height: 1.5px;
		width: 100%;
		display: block;
	}

	.order-details .address-wrap {
		height: 164rpx;
		padding: 0 24rpx;
	}

	.order-details .order-info {
		padding: 12rpx 0;
	}

	.order-details .order-info .item {
		padding: 12rpx 24rpx;
	}

	.order-details .order-info .item .title {
		width: 180rpx;
		flex: none;
	}

	.order-details .price>view {
		height: 60rpx;
		padding: 0 24rpx;
	}

	.order-details .footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		padding: 0 24rpx;
		box-sizing: content-box;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.footer .plain {
		border: 1px solid #BBBBBB;
	}

	.footer .plain.red {
		border: 1px solid $-color-primary;
	}

	.tips-dialog {
		height: 230rpx;
		width: 100%;
	}

	.order-details .invite-btn {
		background: linear-gradient(270deg, #FF2C3C 0%, #F95F2F 100%);
		margin: 30rpx 26rpx 40rpx;
	}
</style>
