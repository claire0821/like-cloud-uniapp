<template>
	<view>
		<view class="confirm-order">
			<view class="confirm-con">
				<navigator hover-class="none" url="/pages/user_address/user_address?type=1">
					<address-item :address="order.address"></address-item>
				</navigator>
				<view class="goods contain">
					<order-products  :list="order.cartItems"></order-products>
					<view class="item row-between">
						<view>配送方式</view>
						<view>快递</view>
					</view>
					<view class="item row-between">
						<view>买家留言</view>
						<u-input v-model="order.note" class="flex1 ml20" :clearable="false" placeholder="请添加备注（150字以内）"></u-input>
					</view>
				</view>
				<view class="contain benefit">
				<!-- 	<view class="item row-between" @tap="showCoupon = true">
						<view>优惠券</view>
						<view class="row">
							<text class="primary" v-if="order.discount_amount">-￥{{order.discount_amount }}</text>
							<text v-else-if="usableCoupon.length" class="primary">{{usableCoupon.length + '张可用'}}</text>
							<text v-else class="muted">无优惠券可用</text>
							<image class="icon-sm ml20" src="/static/images/arrow_right.png"></image>
						</view>
					</view> -->
					<view class="item row" @tap="changeIntegral" v-if="order.integralUse">
						<view>积分抵扣</view>
						<view class="ml20 muted xs row" style="flex:1">
							共{{order.member.integration}}积分{{order.member.integration < order.integral_limit ? "，满" + order.integral_limit + "可用" : "" }}
							<view style="margin-top: 10rpx;" @tap.stop="showDialog">
								<u-icon class="ml10" color="#999"  size="30"  name="question-circle"></u-icon>
							</view>
						</view>
						<checkbox :disabled="order.member.integration < order.integral_limit || order.integral_config == 0" :checked="Boolean(useIntegral)">
						</checkbox>
					</view>
				</view>

				<!-- <view class="pay-way contain">
					<view class="lighter title">支付方式</view>
					<radio-group class="radio-group" @change="radioChange">
						<label v-for="(item, index) in payWayArr" :key="index" class="item row-between">
							<view class="row">
								<image class="icon-lg mr20" :src="item.icon"></image>
								<view class>
									<view class="balck bt10">{{item.name}}</view>
									<view class="muted xs">{{item.extra}}</view>
								</view>
							</view>
							<radio class="radio" :value="String(item.pay_way)" :checked="item.pay_way == payWay"></radio>
						</label>
					</radio-group>
				</view> -->
				<view class="price contain">
					<view class="item row-between">
						<view>商品金额</view>
						<view>¥{{order.totalAmount}}</view>
					</view>
					<view class="item row-between">
						<view>运费</view>
						<view>¥{{order.freightAmount}}</view>
					</view>
					<view class="item row-between" v-if="order.couponAmount && order.couponAmount > 0">
						<view>优惠券</view>
						<view class="primary">-¥{{order.couponAmount}}</view>
					</view>
					<view class="item row-between" v-if="order.integrationAmount && order.integrationAmount > 0">
						<view>积分抵扣</view>
						<view class="primary">-¥{{order.integrationAmount}}</view>
					</view>
				</view>
			</view>
			<view class="footer bg-white row-between fixed">
				<view class="all-price lg row">
					<text>合计：</text>
					<view class="primary">
						<price-format :first-size="36" :second-size="36" :price="order.payAmount"></price-format>
					</view>
				</view>
				<button class="btn br60 white" size="md" hover-class="none" @tap="onSubmitOrder">
					提交订单
				</button>
			</view>
		</view>
		<loading-view v-if="showLoading" background-color="transparent" :size="50"></loading-view>
		<loading-view v-if="isFirstLoading"></loading-view>
		<u-popup v-model="showCoupon" border-radius="14" mode="bottom" closeable>
		    <view class="pop-title row-between">
		        <view class="title">优惠券</view>
		    </view>
		    <view v-if="showCoupon">
		       <tabs :active="popActive" :config="{underLineWidth: 100}">
		            <tab :title="'可使用优惠券 (' + usableCoupon.length + ')'">
		                <!-- <coupon-obj :list="usableCoupon" :type="0" @change="onSelectCoupon" :coupon-id="couponId"></coupon-obj> -->
		            </tab>
		            <tab :title="'不可用优惠券 (' + unusableCoupon.length + ')'">
		                <!-- <coupon-obj :list="unusableCoupon" :type="1" @change="onSelectCoupon"></coupon-obj> -->
		            </tab>
		        </tabs>
		    </view>
		</u-popup>
	</view>
</template>
<script lang="ts" setup>
import {ref,reactive,onMounted,computed} from 'vue'
import {onLoad,onShow} from '@dcloudio/uni-app'
import {confirmOrder} from '@/api/order'
import type {Order} from "@/models/product";
const showLoading = ref<boolean>(false)
const isFirstLoading = ref<boolean>(true)//初次加载
const showCoupon = ref<boolean>(false)//优惠券弹窗
const useIntegral = ref<number>(0)
// const type = ref<number>(0)
const order = reactive<Order>({
	member: null,
	address: null,
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
})

onLoad(() => {
	
})
onShow(async () => {
	let data = await confirmOrder()
	Object.assign(order, data)
	isFirstLoading.value = false
})

const onSubmitOrder = () => {
	
}
const changeIntegral = () => {

}
const showDialog = () => {

}
</script>

<style>
	.confirm-order .confirm-con {
		overflow: hidden;
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
	}

	.confirm-order .contain {
		border-radius: 14rpx;
		margin: 20rpx 20rpx 0;
		background-color: #fff;
		overflow: hidden;
	}

	.confirm-order .img-line {
		height: 1.5px;
		width: 100%;
		display: block;
	}


	.confirm-order .coupons {
		height: 100rpx;
		padding: 0 24rpx;
	}

	.goods .title {
		padding: 22rpx 24rpx;
		border-bottom: 1px solid #F6F6F6;
	}

	.goods .all-num {
		padding: 22rpx 24rpx;
		border-bottom: 1px dotted #F6F6F6;
	}

	.confirm-order .footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		padding: 0 30rpx;
		box-sizing: content-box;
		padding-bottom: env(safe-area-inset-bottom);
	}


	.confirm-order .pay-way .title {
		padding: 20rpx 24rpx;
	}

	.confirm-order .pay-way .radio-group .item {
		height: 120rpx;
		padding: 0 24rpx;
	}

	.confirm-order .price {
		padding: 28rpx 20rpx;
	}

	.confirm-order .price .item:not(:last-of-type) {
		margin-bottom: 20rpx;
	}

	.confirm-order .goods>.item,
	.confirm-order .benefit>.item {
		padding: 0 24rpx;
		height: 80rpx;
	}

	.confirm-order .btn {
		background: linear-gradient(90deg, rgba(249, 95, 47, 1) 0%, rgba(255, 44, 60, 1) 100%);
		padding: 0 50rpx;
	}

	.confirm-order .van-cell:after {
		border: none;
	}

	.goods .shop-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.pop-title {
		height: 100rpx;
		border-bottom: 1rpx solid #F2F2F2;
	}

	.pop-title .title {
		margin-left: 30rpx;
		font-size: 34rpx;
		font-weight: bold;
		line-height: 36rpx;
	}
</style>
