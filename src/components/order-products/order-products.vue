<template>
<view class="order-goods bg-white">
    <view v-for="(item, index) in props.list" :key="index" class="item-wrap">
        <view class="item row">
            <view class="goods-img">
                <custom-image width="180rpx" radius="10rpx" height="180rpx" lazy-load :src="item.skuPic"></custom-image>
            </view>
            <view class="goods-info ml20 flex1">
               <view class="goods-name line2 mb10">
                   <!-- <u-tag class="mr10" v-if="team.need" :text="team.need + '人团'" size="mini" type="primary" mode="plain" /> -->
					 {{item.skuName }}</view>
                <view class="goods-spec xs muted mb20">{{item.skuAttrsVals}}</view>
                <view class="row-between">
                    <view class="goods-price row">
                        <view class="primary">
							<price-format v-if="item.showMemberPrice" :weight="500" :subscript-size="24" :first-size="34" :second-size="24" :price="item.memberPrice"></price-format>
                            <price-format v-else :weight="500" :subscript-size="24" :first-size="34" :second-size="24" :price="item.skuPrice"></price-format>
                        </view>
						<view class="vip-price row" v-if="item.showMemberPrice">
							<view class="price-name xxs">会员价</view>
							<view style="padding: 0 10rpx"> 
								<price-format :price="item.showMemberPrice" :first-size="22" :second-size="22" :subscript-size="22"
									 :weight="500" color="#7B3200"></price-format>
							</view>
						</view>
                    </view>
                    <view class="goods-num sm ">x{{item.skuQuantity}}</view>
                </view>
            </view>
        </view>
       <!-- <view class="goods-footer row" v-if="link && item.comment_btn || item.refund_btn">
            <view style="flex: 1"></view>
            <navigator class="mr20" hover-class="none" :url="'/pages/bundle/goods_reviews/goods_reviews?id=' + item.id" v-if="item.comment_btn">
                <button size="xs" class="plain br60" hover-class="none" >
                    评价晒图
                </button>
            </navigator>
            <navigator v-if="item.refund_btn" hover-class="none" :url="'/pages/bundle/apply_refund/apply_refund?order_id=' + item.order_id + '&item_id=' + item.item_id">
                <button size="xs" class="plain br60" hover-class="none">
                    申请退款
                </button>
            </navigator> 
        </view> -->
    </view>
</view>
</template>

<script lang="ts" setup>
import {ref, onMounted,watch} from 'vue'
import {onLoad,onShow } from '@dcloudio/uni-app'
import type {CartItem} from "@/models/product";
import type { OrderType } from "@/models/type.js"
const props = defineProps<{
        list: CartItem[],
        // link: boolean,
		// team: Object
    }>();
watch(
	() => props.list,
	(newVal) => {
		console.log('newVal')
		console.log(newVal)
	}
)
onShow(() => {
	console.log('props.list')
	console.log(props.list)
})
</script>

<style lang="scss">
.order-goods {
	.item {
	    padding: 20rpx 24rpx;
		.vip-price {
			margin: 0 10rpx;
			background-color: #FFE9BA;
			line-height: 30rpx;
			border-radius: 6rpx;
			overflow: hidden;
			.price-name {
				background-color: #101010;
				padding: 3rpx 10rpx;
				color: #FFD4B7;
				position: relative;
				overflow: hidden;
				&::after {
					content: '';
					display: block;
					width: 20rpx;
					height: 20rpx;
					position: absolute;
					right: -15rpx;
					background-color: #FFE9BA;
					border-radius: 50%;
					top: 50%;
					transform: translateY(-50%);
					box-sizing: border-box;
				}
			}
		}
	}
	.goods-footer {
	    height: 70rpx;
	    align-items: flex-start;
	    padding: 0 24rpx;
		.plain {
		    border: 1px solid #999;
		    height: 52rpx;
		    line-height: 52rpx;
		    font-size: 26rpx;
		}
	}
}




</style>