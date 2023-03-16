<template>
	<view class="shop-cart">
		<view class="main " :style="{'padding-bottom':  (cartType == 1 ?  '100rpx' : 0)}">
			<view v-for="(item, index) in cartLists.items" :key="index" class="cart-list mb20" v-show="!(cartType!=1)">
				<view class="cart-item bg-white" :class="{invalid: item.status != 0}">
					<view class="row-between select" v-if="item.status == CartItemStatusEnum.NORMAL">
						<checkbox :value="item.skuId + ''" :checked="item.selected" @click="changOneSelect(item.skuId, item.selected)">选择</checkbox>
						<view :data-cartid="item.skuId" @click="changeDelPopup(item.skuId)">
							<image class="icon-xl" src="/static/images/icon_del.png" />
						</view>
					</view>
					<view class="select row-between sm muted" v-else>
						已失效
						<view :data-cartid="item.skuId" @click="changeDelPopup(skuId)">
							<image class="icon-xl" src="/static/images/icon_del.png" />
						</view>
					</view>
					
					<view class="row" style="padding: 20rpx">
						<custom-image width="180rpx" height="180rpx" radius="10rpx" class="goods-img mr20" lazy-load :src="item.image" />
						<view class="info" style="flex: 1">
							<view class="line2 nr">{{item.title}}</view>
							<view class="muted xs line1 mt10">
								{{item.saleValueStr}}
							</view>
							<view class="row-between mt20">
								<view class="price row primary">
									<!-- <price-format :price="item.price" :firstSize="32" :secondSize="32" :showSubscript="true" :subscriptSize="32"></price-format> -->
										<price-format :price="item.price" ></price-format>
								</view>
								<view class="cartNum">
									<u-number-box :disabled="item.status != CartItemStatusEnum.NORMAL" v-model="item.count" :min="1" integer @change="countChange(item)" />
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cart-null column-center bg-white mb20" style="padding: 80rpx 0 50rpx" v-show="!(cartType != 2)">
				<image class="img-null" src="/static/images/cart_null.png"></image>
				<view class="muted mb20">购物车暂无任何商品~</view>
				<navigator open-type="switchTab" url="/pages/index/index" hover-class="none" class="primary br60 btn row-center">去逛逛</navigator>
			</view>
			<view v-if="!isLogin" class="login column-center">
				<image class="img-null" src="/static/images/cart_null.png"></image>
				<view class="muted mt20">登录后才能查看购物车哦</view>
				<navigator class="white br60 row-center btn" url="/pages/login/login">
					<!-- <image class="mr10" src="/static/images/icon_wechat.png"></image> -->
					<text>去登录</text>
				</navigator>
			</view>
			<!-- <recommend v-if="isShow"></recommend> -->
		</view>
		<view class="footer row bg-white" v-show="!(cartType != 1)">
			<checkbox-group class="row" @change="changeAllSelect">
				<checkbox id="checkAll" value="all" :checked="isSelectedAll"></checkbox>
				<label for="checkAll" class="ml10">全选</label>
			</checkbox-group>
			<view class="all-price lg mr20 row-end">
				<view>合计：</view>
				<view class="primary">￥{{cartLists.totalAmount || 0}}</view>
                
			</view>
			<view class="right-btn br60 white"  :style="nullSelect ? 'background: #d7d7d7;' : ''" @tap="goToConfirm">去结算</view>
		</view>
		<u-modal v-model="delPopup" :showCancelButton="true" comfirm-text="狠心删除" confirm-color="#FF2C3C" :show-title="false"
		 @confirm="handleDeleteCartItem" @cancel="delPopup = false">
			<view class="column-center tips-dialog" style="padding-top: 40rpx">
				<image class="icon-lg" src="/static/images/icon_warning.png" />
				<view style="margin:30rpx 0;">确认删除该商品吗？</view>
			</view>
		</u-modal>
		<tabbar />
	</view>
		
</template>

<script lang="ts" setup>
import {ref,reactive,onMounted,computed} from 'vue'
import {onLoad,onShow} from '@dcloudio/uni-app'
import {CartItemStatusEnum} from '@/enums/appEnums'
import {getCartItems,addCartItem,changeCartItemSelected,countCartItem,deleteCartItem,clearCartItem,selectAllCartItem} from '@/api/cart'

const cartLists = reactive<Cart>({
	items: [],
	countNum: 0,
	countType: 0,
	totalAmount: 0
})
const isLogin = ref<boolean>(true)
const cartType = ref<number>(0)
const delPopup = ref<boolean>(false)//删除弹窗
let delSkuId: number;//记录删除的id
const isSelectedAll = ref<boolean>(false)//是否全选
const value = ref<number>(1)
// const totalPrice = ref<boolean>()
onLoad(() => {
	// setTabbar()
})
onShow(() =>{
	getCartList()
})
const nullSelect = computed(() => {
	let index = cartLists.items.findIndex((item: CartItem) => {
		return item.selected && item.status == CartItemStatusEnum.NORMAL
	})
	if(index == -1) {
		return true
	} else {
		return false
	}
})
// const totalPrice = computed(() => {
// 	let res: number
// 	cartLists.value.forEach((item: CartItem) => {
// 		if(item.selected) {
// 			totalPrice
// 		}
// 	})
// })
const getCartList = async () => {
	cartType.value = 0
	let data = await getCartItems()
	Object.assign(cartLists,data)
	
	if(cartLists.countNum == 0) {
		cartType.value = 2
	} else {
		cartType.value = 1
		isSelectedAll.value = true
		cartLists.items.some((item: CartItem) => {
			if(!item.selected) {
				isSelectedAll.value = false
			}
		})
	}
}
//跳转页面
const goPage = (e: any) => {
	uni.navigateTo({
		url: e.currentTarget.dataset
	});
}
//商品选中状态改变
const changOneSelect = async (skuId: number, selected: boolean) => {
	selected = !selected
	await changeCartItemSelected(skuId, selected)
	getCartList()
}
//删除弹窗
const changeDelPopup = (skuId: number) => {
	delSkuId = skuId
	delPopup.value = true
}
//删除商品
const handleDeleteCartItem = async () => {
	await deleteCartItem(delSkuId)
	getCartList()
}
// 更改全选状态
const changeAllSelect = async () => {
	isSelectedAll.value = !isSelectedAll.value
	cartLists.items.forEach((item: CartItem) => {
		if(item.status == CartItemStatusEnum.NORMAL) {
			item.selected = isSelectedAll.value
		}
	})
	await selectAllCartItem(isSelectedAll.value);
	getCartList()
}
//更改数量
const countChange = async (item: CartItem) => {
	await countCartItem(item.skuId,item.count)
	getCartList()
}
//结算
const goToConfirm = () => {
	
}
</script>
<style lang="scss">
	.shop-cart {
		.main {
			padding-bottom: 100rpx;
		}

		.cart-list {
			.cart-item {
				margin: 20rpx 20rpx 0;
				border-radius: 10rpx;
				// &.invalid {
				// 	background-color: $-color-body;
				// }
			}

			.select {
				height: 80rpx;
				padding: 0 20rpx;
				border-bottom: $-solid-border;
			}
		}

		.cart-null {
			.btn {
				border: 1px solid $-color-primary;
				width: 184rpx;
				margin-left: auto;
				margin-right: auto;
				padding: 8rpx 24rpx;
			}
		}

		.footer {
			position: fixed;
			padding: 0 24rpx;
			width: 100%;
			height: 100rpx;
			box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
			bottom: var(--window-bottom);
			box-sizing: border-box;
			z-index: 20;

			.all-price {
				text-align: right;
				flex: 1;
			}

			.right-btn {
				padding: 13rpx 45rpx;
				background: linear-gradient(90deg, rgba(249, 95, 47, 1) 0%, rgba(255, 44, 60, 1) 100%);
			}
		}

		.login {
			height:calc(100vh - var(--window-bottom));
			background: #fff;
			text-align: center;

			.btn {
				background-color: #09BB07;
				width: 280rpx;
				line-height: 70rpx;
				margin: 40rpx auto 0;

				image {
					width: 50rpx;
					height: 50rpx;
				}
			}
		}
	}
</style>
