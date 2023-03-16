<template>
	<view>
		<view class="order-list">
			<navigator v-for="(item, index) in orderList" :key="index" hover-class="none" class="order-item bg-white mt20" :url="'/pages/order_details/order_details?sn=' + item.orderSn">
				<view class="order-header row-between">
					<view class="row">
						<view v-if="item.type == TypeEnum.SECKILL" class="mr10">
							<u-tag text="秒杀" size="mini" type="primary" mode="plain" />
						</view>
						<view v-if="item.type == TypeEnum.COLLAGE" class="mr10">
							<u-tag text="拼团" size="mini" type="primary" mode="plain" />
						</view>
							<view v-if="item.type == TypeEnum.BARGAIN" class="mr10">
							<u-tag text="砍价" size="mini" type="primary" mode="plain" />
						</view>
						订单编号：{{item.orderSn}}
					</view>
					<view :class="item.order_status == 4 ? 'muted' : 'primary'">{{getOrderStatus(item.order_status)}}</view>
				</view>
				<view class="order-con">
					<order-products :list="item.orderItems"></order-products>
					<view class="all-price row-end">
						<text class="muted xs">共{{item.productCount}}件商品，总金额：</text>
						<price-format :subscript-size="30" :first-size="30" :second-size="30" :price="item.totalAmount"></price-format>
					</view>
				</view>
				<view class="order-footer row">
					<view style="flex: 1">
						<view class="primary sm row" v-if="item.status == 0">支付剩余 <u-count-down separator="zh" :show-hours="false"
							 :show-seconds="false" :timestamp="getCancelTime(item.order_cancel_time)" separator-color="#FF2C3C" color="#FF2C3C" :separator-size="26"
							 :font-size="26" bg-color="transparent" @end="refresh"></u-count-down>自动关闭</view>
					</view>
					<view v-if="item.status == 0" class="ml20">
						<button size="sm" class="btn bg-primary br60 white" @tap.stop="payNow(item.id)">
							立即付款
						</button>
					</view>
					<view v-if="item.status == 0">
						<button size="sm" class="plain br60 lighter" hover-class="none" @tap.stop="cancelOrder(item.id)">
							取消订单
						</button>
					</view>
					<view v-if="item.status == 2" @tap.stop="goPage('/pages/bundle/goods_logistics/goods_logistics?id=' + item.id)">
						<button size="sm" class="btn plain br60 lighter" hover-class="none">查看物流</button>
					</view>
					<view v-if="item.status == 4">
						<button size="sm" class="btn plain br60 lighter" hover-class="none" @tap.stop="delOrder(item.id)">删除订单</button>
					</view>
					<view v-if="item.status == 3" class="ml20">
						<button size="sm" hover-class="none" class="btn plain btn br60 primary red">
							去评价
						</button>
					</view>
					<view v-if="item.status == 2" class="ml20">
						<button size="sm" class="btn plain br60 primary red" hover-class="none" @tap.stop="comfirmOrder(item.id)">确认收货</button>
					</view>
				</view>
			</navigator>
			<!-- <loading-footer :status="status" :slot-empty="true" @refresh="reload">
				<view slot="empty" class="column-center" style="padding-top: 200rpx">
					<image class="img-null" src="/static/images/goods_null.png"></image>
					<text class="lighter">暂无订单</text>
				</view>
			</loading-footer> -->
		</view>
<!-- 		<order-dialog ref="orderDialog" :order-id="orderId" :type="type" @refresh="refresh"></order-dialog>
		<loading-view v-if="showLoading" background-color="transparent" :size="50"></loading-view> -->
	</view>
</template>
<script lang="ts" setup>
import {ref,reactive,onMounted,computed,nextTick,shallowRef} from 'vue'
import {getOrderList} from '@/api/order'
import type { Order } from "@/models/type.js"
import { LoadTypeEnum,OrderTypeEnum,TypeEnum} from '@/enums/appEnums'

const props = defineProps({
	orderType: {
	  type: Number,
	  default: () => (OrderTypeEnum.ALL)
	}
})
const orderList = reactive<Order[]>([])
const showLoading = ref<boolean>(false)
const orderId = ref<number>(-1)
const type = ref<number>(-1)
const orderDialog = shallowRef()
const status = ref(LoadTypeEnum.LOADING)
let pageNo = 1
let pageSize = 10

const getOrderListFun = async () => {
	let data = await getOrderList({
	    pageNo,
	    pageSize
	})
	Object.assign(orderList,data.lists)
	console.log(orderList)
}
const closeOrder = (id: number) => {
	orderId.value = id
	type.value = 1
	nextTick(() => {
		orderDialog.value.open()
	})
}

const deleteOrder = (id: number) => {
	orderId.value = id
	type.value = 2
	nextTick(() => {
		orderDialog.value.open()
	})
}
const completeOrder = (id: number) => {
	orderId.value = id
	type.value = 3
	nextTick(() => {
		orderDialog.value.open()
	})
}

const reload = () => {
	status.value = loadingType.LOADING
	getOrderListFun()
}
const getOrderStatus = (sn: any) => {
	
}

const refresh = () => {
	
}
onMounted(() => {
    getOrderListFun()
})

</script>

<style lang="scss">
	.order-list {
		min-height: calc(100vh - 80rpx);
		padding: 0 20rpx;
		overflow: hidden;

		.order-item {
			border-radius: 10rpx;

			.order-header {
				height: 80rpx;
				padding: 0 24rpx;
				border-bottom: 1px dotted #E5E5E5;
			}

			.all-price {
				text-align: right;
				padding: 0 24rpx 20rpx;
			}

			.order-footer {
				height: 100rpx;
				border-top: $-solid-border;
				padding: 0 24rpx;

				.plain {
					border: 1px solid #BBBBBB;

					&.red {
						border-color: $-color-primary;
					}

				}
			}
		}
	}
</style>
