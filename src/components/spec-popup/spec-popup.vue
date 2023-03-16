<template>
	<u-popup v-model="showPop" mode="bottom" border-radius="14" :closeable="true" @close="onClose" :safe-area-inset-bottom="true">
		<view class="bg-white spec-contain">
			<view class="spec-header row">
				<custom-image class="goods-img mr20" radius="10rpx" @tap="previewImage()" :src="checkedProduct.img"></custom-image>
				<view class="goods-info" v-if="!isBargain">
					<view class="primary row">
						<price-format :first-size="46" :second-size="32" :subscript-size="32" :price="props.productDetail.activityType == ProductActivityTypeEnum.GROUP_BARGAIN ? checkedProduct.team_price : checkedProduct.price" :weight="500"></price-format>
						<view class="vip-price row" v-if="props.productDetail.activityType == ProductActivityTypeEnum.NORMAL && checkedProduct.memberPrice">
							<view class="price-name xxs">会员价</view>
							<view style="padding: 0 11rpx"> 
								<price-format :price="checkedProduct.memberPrice" :first-size="22" :second-size="22" :subscript-size="22"
									 :weight="500" color="#7B3200"></price-format>
							</view>
						</view>
					</view>
					<view class="sm" v-show="showStock">
						库存：{{checkedProduct.stock}}件
					</view>
					<view class="sm">
						<text>已选择：{{errorSaleValueStr || checkedProduct.saleValueStr}}，{{buyNum}}件</text>
					</view>
				</view>
                <view class="goods-info" v-else>
                    <view class="xs">
                        最低可砍至<text class="sm" style="color: #F95F2F;">¥{{checkedProduct.activityPrice}}</text>
                    </view>
                    <view class="muted xs mt10">
                        原价 ¥{{checkedProduct.price}}
                    </view>
                    <view class="sm lighter mt20">
                    	<text>已选择：{{saleValueStr}}</text>
                    </view>
                </view>
			</view>
			<view class="spec-main">
				<scroll-view style="max-height: 600rpx;" scroll-y="true">
					<view class="spec-list">
						<view v-for="(item, index) in saleAttrs" :key="index" class="spec">
							<view class="name mb20">{{ item.attrName }}</view>
							<view class="row wrap">
								<view v-for="(valueItem, index2) in item.attrValues" :key="index2" 
								:class="'spec-item sm ' + ( valueItem.enable == false ? 'enable' : (valueItem.checked ? 'checked' : '' ) )"
								 @tap="choseSaleAttrItem(index,index2)">
									{{ valueItem.attrValue }}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="good-num row-between ml20 mr20">
					<view class="label">数量</view>
					<u-number-box v-model="buyNum" :min="1" :max="checkedProduct.stock" :disabled="disabledNumberBox"></u-number-box>
				</view>
			</view>
			<view class="btns row-between bg-white">
				<button v-if="showAdd" class="add-cart br60 white btn" size="lg" @tap="addCart()">{{yellowBtnText}}</button>
				<button v-if="showBuy" class="bg-primary br60 white btn" size="lg" @tap="buyNow()">{{redBtnText}}</button>
				<button v-if="showConfirm" class="bg-primary br60 white btn" size="lg" @tap="confirm()">确定</button>
			</view>
		</view>
	</u-popup>
</template>

<script lang="ts" setup>
import {ref, reactive, watch } from 'vue'
import {ProductActivityTypeEnum} from '@/enums/appEnums'
const emit = defineEmits<{
	(event: 'close'): void//关闭弹窗
	(event: 'addcart', skuId: number, buyNum: number): void//加入购物车
	(event: 'buynow', skuId: number, buyNum: number): void//立即购买
	(event: 'confirm', skuId: number, buyNum: number): void//确定
	// (event: 'change', checkedProduct: any): void//更改选中商品
	(event: 'change', skuId: number): void//更改选中商品
}>()
const showPop = ref<Boolean>(false)
// const checkedProduct = ref<CheckedProduct>()
const checkedProduct = reactive<CheckedProduct>({//选中的sku
    skuId: NaN,
    name: '',
    desc: '',
    img: '',
    title: '',
    subtitle: '',
    price: NaN,
    saleCount: NaN,
    saleAttr: [],
    saleValueStr: '',
	stock: 0,
	memberPrice: NaN,
	activityPrice: NaN
})
const buyNum = ref<number>(1)//默认加购一个商品
const showAdd = ref<boolean>(true)
const showBuy = ref<boolean>(true)
const showConfirm = ref<boolean>(true)
const redBtnText = ref<string>('立即购买')
const yellowBtnText = ref<string>('加入购物车')
const isSeckill = ref<boolean>(false)//是否秒杀
const saleValueStr = ref<string>()//销售属性
const errorSaleValueStr = ref<string>('')//缺少某个销售参数时提示
const saleAttrs = ref<any[]>([])
// const imgs = ref<string[]>([])

const props = defineProps({
    show: {
        type: Boolean,
        default: () => (false)
    },
	products: {
		type: Object,
		default: () => (null)
	},
	showStock: {
	 type: Boolean,
		default: () => (true)
	},
	disabledNumberBox: {
	 type: Boolean,
		default: () => (false)
	},
	isBargain: {
	 type: Boolean,
		default: () => (false)
	},
	// activityType: {
	//  type: Number,
	// 	default: () => (3)
	// },
	productDetail:　{
		type: Object,
		default: () => ({})
	}
	
})
//展示商品图片
const previewImage = () => {
	let imgs = [checkedProduct.img]
	uni.previewImage({
		current: 0,
		urls: imgs // 需要预览的图片http链接列表
	});
}
const addCart = () => {
	emit('addcart',checkedProduct.skuId,buyNum.value)
}
const buyNow = () => {
	emit('buynow',checkedProduct.skuId,buyNum.value)
}
const confirm = () => {
	emit('confirm',checkedProduct.skuId,buyNum.value)
}
const onClose = () => {
	emit('close')
}
//选中销售属性
const choseSaleAttrItem = (index1: number,index2: number) => {
	if(!saleAttrs.value[index1].attrValues[index2].enable) return
	saleAttrs.value[index1].attrValues[index2].checked = !saleAttrs.value[index1].attrValues[index2].checked
	//取消选中
	if(!saleAttrs.value[index1].attrValues[index2].checked) {
		saleAttrs.value[index1].checked = false//标记这个销售属性未选
		checkErr()
		return
	}
	//取消同级属性的选中
	saleAttrs.value[index1].checked = true//标记这个销售属性已选
	for(let i = 0; i < saleAttrs.value[index1].attrValues.length; i++) {
		if(i != index2) {
			saleAttrs.value[index1].attrValues[i].checked = false
		}
	}
	//销售属性是否能组成sku
	let ids = new Set(saleAttrs.value[index1].attrValues[index2].skuIds)
	for(let i = 0; i < saleAttrs.value.length; i++) {
		if(i == index1) {
			continue
		}
		//根据选中的销售属性设置其他销售属性是否可选
		saleAttrs.value[i].attrValues.forEach((valItem: any) => {
			// 交集
			let intersect = new Set([...valItem.skuIds].filter(x => ids.has(x)))
			valItem.enable = intersect.size > 0 ? true : false
			//当属性不可选时取消已选中的
			if(!valItem.enable) {
				if(valItem.checked) {
					valItem.checked = false
					saleAttrs.value[i].checked = false
				}
			}
		})
	}
	//检查是否全部级别已选
	checkErr()
}
const checkErr = () => {
	errorSaleValueStr.value = ''
	for(let i = 0; i < saleAttrs.value.length; i++) {
		if(!saleAttrs.value[i].checked) {
			if(errorSaleValueStr.value.length == 0) {
				errorSaleValueStr.value = '请选择'
			}
			errorSaleValueStr.value += saleAttrs.value[i].attrName
			errorSaleValueStr.value += ' '
		}
	}
	
	let intersect = new Set()
	//判断是否组成sku
	for(let i = 0; i < saleAttrs.value.length; i++) {
		saleAttrs.value[i].checked = false//监测是否某个属性没有必须项
		for(let j = 0; j < saleAttrs.value[i].attrValues.length; j++) {
			if(saleAttrs.value[i].attrValues[j].checked) {
				saleAttrs.value[i].checke = true
				intersect = new Set([...saleAttrs.value[i].attrValues[j].skuIds].filter(x => intersect.has(x)))
				break;
			}
		}
	}
	//TODO 提示未选中的属性
	if(intersect.size > 0) {
		checkSkuId(Array.from(intersect)[0])
	}
}
//找到选中的商品
const checkSkuId = (skuId: number) => {
	emit('change',skuId)
}
//是否展示弹窗
watch(() => props.show,
	(newVal) => {
		showPop.value = newVal
	})

watch(() => props.productDetail,
	(newVal) => {
		Object.assign(checkedProduct,newVal.checkedProduct)
		// checkedProduct = newVal.checkedProduct
		// imgs.value = [...newVal.checkedProduct.img]
		//判断三个按钮显示
		console.log(newVal.activityType)
		if(newVal.activityType == ProductActivityTypeEnum.SECKILL) {
			isSeckill.value = true
			showAdd.value = true
			showBuy.value = false
			showConfirm.value = true
			redBtnText.value = '立即抢购'
			yellowBtnText.value = ''
		} else if(newVal.activityType == ProductActivityTypeEnum.GROUP_BARGAIN) {
			isSeckill.value = false
			showAdd.value = true
			showBuy.value = false
			showConfirm.value = true
			redBtnText.value = '立即开团'
			yellowBtnText.value = '单独购买'
		} else {
			isSeckill.value = false
			showAdd.value = true
			showBuy.value = true
			showConfirm.value = false
			redBtnText.value = '立即购买'
			yellowBtnText.value = '加入购物车'
		}
		saleAttrs.value = newVal.saleAttr
	
		saleAttrs.value.forEach((value1,index1,array1) => {
			value1.checked = false
			value1.attrValues.forEach((value2,index2,array2) => {
				value2.enable = true
				value2.checked = false
				
				value2.skuIds.some((id: number) => {
					if(id == checkedProduct.skuId) {
						choseSaleAttrItem(index1, index2)
					}
				})
			})
		})
	}
)

</script>


<style lang="scss" scoped>
	.spec-contain {
		border-radius: 10rpx 10rpx 0 0;
		overflow: hidden;
		position: relative;

		.close {
			position: absolute;
			right: 10rpx;
			top: 10rpx;
		}

		.spec-header {
			padding: 30rpx;
			padding-right: 70rpx;
			align-items: flex-start;
			border: $u-solid-border;
			.vip-price {
				margin: 0 24rpx;
				background-color: #FFE9BA;
				line-height: 36rpx;
				border-radius: 6rpx;
				overflow: hidden;
				.price-name {
					background-color: #101010;
					padding: 3rpx 12rpx;
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
			.goods-img {
				width: 180rpx;
				height: 180rpx;
				flex: none;
			}
		}

		.spec-main {
			.spec-list {
				padding: 30rpx 20rpx;

				.spec-item {
					line-height: 52rpx;
					padding: 0 20rpx;
					background-color: #F4F4F4;
					border-radius: 60rpx;
					margin: 0 20rpx 20rpx 0;

					&.checked {
						background-color: $-color-primary;
						color: #fff;
					};
					&.unenable {
						background-color: $u-type-error;
						color: #fff;
					}

				}
			}

		}
		.btns {
			height: 120rpx;
			padding: 0 30rpx;
			margin-top: 80rpx;
		
			.add-cart {
				background-color: #FF9E1E;
			}
		
			.btn {
				margin: 0 10rpx;
				flex: 1;
			}
		}
	}
</style>
