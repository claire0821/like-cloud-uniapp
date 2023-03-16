<template>
	<view>
		<!-- 一行两列商品展示 -->
		<view class="product-list" v-if="showType == ProductListShowTypeEnum.TWO">
			<view v-for="(item, index) in res" :key="index" class="product-item">
				<view class="image-wrapper" @click="navigateToDetailPage(item)">
					<u-image :src="item.skuImg" width="100%" height='330rpx' mode="aspectFill">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
				<view class="product-detail">
					<div class="title clamp" v-html="lightSearchStr(keyword,item.skuTitle)"
						@click="navigateToDetailPage(item)">

					</div>
					<view class="price-box" @click="navigateToDetailPage(item)">
						<div class="price" v-if="item.price!=undefined">
							¥<span>{{ $options.filters.productFormatPrice(item.price )[0] }} </span>.{{
	            $options.filters.productFormatPrice(item.price )[1]
	          }}
						</div>
					</view>
					<div class="promotion" @click="navigateToDetailPage(item)">
						<div v-if="item.salesModel == 'WHOLESALE'">
							<span>批</span>
						</div>
						<div v-for="(promotionItem,promotionIndex) in  getPromotion(item)" :key="promotionIndex">
							<span v-if="promotionItem.indexOf('COUPON') != -1">劵</span>
							<span v-if="promotionItem.indexOf('FULL_DISCOUNT') != -1">满减</span>
							<span v-if="promotionItem.indexOf('SECKILL') != -1">秒杀</span>
						</div>
					</div>
					<div class="count-config" @click="navigateToDetailPage(item)">
						<span>已售 {{ item.buyCount || "0" }}</span>
						<span>{{ item.commentNum || "0" }}条评论</span>
					</div>
					<div class="store-seller-name" v-if="storeName" @click="navigateToStoreDetailPage(item)">
						<div class="text-hidden">
							<u-tag style="margin-right: 10rpx" size="mini" mode="dark" v-if="item.selfOperated"
								text="自营" type="error" />
							<span>{{ item.storeName || "暂无" }}</span>
						</div>
						<span>
							<u-icon name="arrow-right"></u-icon>
						</span>
					</div>
				</view>
			</view>
		</view>
		<!-- 一行一列商品展示 -->
		<div v-if="showType == ProductListShowTypeEnum.ONE">
			<div v-for="(item, index) in res" :key="index" class="product-row">
				<div class="flex product-col">
					<div class="product-img" @click="navigateToDetailPage(item)">
						<u-image width="230rpx" border-radius='16' height="230rpx" :src="item.skuImg">
							<u-loading slot="loading"></u-loading>
						</u-image>
					</div>
					<div class="product-detail">
						<div class="title clamp3" @click="navigateToDetailPage(item)">{{ item.productName }}</div>
						<view class="price-box" @click="navigateToDetailPage(item)">
							<div class="price" v-if="item.price!=undefined">
								¥<span>{{ $options.filters.productFormatPrice(item.price )[0] }} </span>.{{
			            $options.filters.productFormatPrice(item.price )[1]
			          }}
							</div>
						</view>
						<div class="promotion" @click="navigateToDetailPage(item)">
							<div v-if="item.salesModel == 'WHOLESALE'">
								<span>批</span>
							</div>
							<div v-for="(promotionItem,promotionIndex) in  getPromotion(item)" :key="promotionIndex">
								<span v-if="promotionItem.indexOf('COUPON') != -1">劵</span>
								<span v-if="promotionItem.indexOf('FULL_DISCOUNT') != -1">满减</span>
								<span v-if="promotionItem.indexOf('SECKILL') != -1">秒杀</span>
							</div>
						</div>
						<div style="overflow: hidden" @click="navigateToDetailPage(item)" class="count-config">
							<span style="float: left; font-size: 22rpx">已售 {{ item.buyCount || '0' }}</span>
							<span style="float: right; font-size: 22rpx">{{ item.commentNum || '0' }}条评论</span>
						</div>
						<div style="overflow: hidden" @click="navigateToStoreDetailPage(item)" class="count-config">
							<div class="text-hidden" v-if="storeName">
								<u-tag style="margin-right: 10rpx" size="mini" mode="dark" v-if="item.selfOperated"
									text="自营" type="error" />
								<span class="line1-store-name">{{ item.storeName }}</span>
								<span class="to-store">进店<u-icon size="24" name="arrow-right" color="#666"></u-icon>
								</span>
							</div>
							<span>
								<u-icon name="arrow-right" color="#c5c5c5"></u-icon>
							</span>
						</div>
					</div>
				</div>

			</div>
		</div>

	</view>
</template>

<script lang="ts" setup>
import commonTpl from '@/components/product-list/common'
import { ProductListShowTypeEnum } from '@/enums/appEnums'
import { watch } from 'vue'

const props = defineProps({
	// 遍历的数据
    res: {
        type: Array,
        default: () => ([])
    },
	// 一行两列还是一行一列显示
    showType: {
        type: String,
        default: () => (ProductListShowTypeEnum.TWO)
    },
	storeName: {
		type: Boolean,
		default: true
	},
	keyword: {
		type: null,
		default: ''
	}
})

watch(
    () => props.keyword,
    (n, o) => {
        if (n) {
			//lightSearchStr(n)
        }
    }
)
// 高亮显示搜索内容	
const lightSearchStr = (keyword: string, str: string) => {
	if (!keyword) {
		return str
	} else {
		let unicodes = '';
		for (let i of Array.from(keyword)) {
			unicodes += unicode(i) + "|"
		}
		const rule = '(' + unicodes + ')'
		const reg = new RegExp(rule, 'gi');
		return str ? str.replace(reg, matchValue =>
			`<span style="color:#333333">${matchValue}</span>`) : ''
	}
}
//  转换为unicode
const unicode = (str: any) => {
	let value = ''
	for(let i = 0; i < str.length; i++) {
		value += '\\u' + left_zero_4(parseInt(str.charCodeAt(i)).toString(16))
	}
}
const left_zero_4 = (str: any) => {
	if (str != null && str != '' && str != 'undefined') {
		if (str.length == 2) {
			return '00' + str;
		}
	}
	return str;
}

// 数据去重一下 只显示一次 减免 劵 什么的
const getPromotion = (item: any) => {
	if (item.promotionMap) {
		let array = [];
	    Object.keys(item.promotionMap).forEach((child) => {
		    if (!array.includes(child.split("-")[0])) {
				array.push(child.split("-")[0]);
			}
		});
	return array;
	}	
}
// 跳转到商品详情
const navigateToDetailPage = (item: any) => {
	uni.navigateTo({
		url: `/pages/product/product?id=${item.content.id}&productId=${item.content.productId}`,
	});
}
// 跳转地址
const navigateToStoreDetailPage = (item: any) => {
	uni.navigateTo({
		url: `/pages/product/shopPage?id=${item.content.storeId}`,
	});
}
</script>

<style lang='scss' scoped>
/* 商品列表 */
		.product-list {
			display: flex;
			flex-wrap: wrap;
			margin: 10rpx 20rpx 284rpx;
			width: 100%;
	
			>.product-item {
				background-color: #ffffff;
				display: flex;
				border-radius: 16rpx;
				flex-direction: column;
				width: calc(50% - 30rpx);
				margin-bottom: 20rpx;
				padding-bottom: 20rpx;
	
				&:nth-child(2n + 1) {
					margin-right: 20rpx;
				}
	
	
				.image-wrapper {
					width: 100%;
					height: 330rpx;
					border-radius: 16rpx 16rpx 0 0;
					overflow: hidden;
					padding: 0;
				}
			}
	
			.count-config,
			.store-seller-name {
				font-size: 24rpx;
			}
	
			.text-hidden {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	
	
		.product-row {
			background: #fff;
			padding: 16rpx;
	
			>.product-col {
				display: flex;
	
				>.product-img {
					overflow: hidden;
					flex: 4;
				}
	
				>.product-detail {
					flex: 7;
				}
			}
		}
	
		.product-detail {
			margin: 0 20rpx;
	
			>.title {
				font-size: 28rpx;
				color: $u-font-color-dark;
				line-height: 1.5;
				height: 86rpx;
				padding: 10rpx 0 0;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
	
			.promotion {
				margin-top: 4rpx;
				display: flex;
	
				div {
					span {
						font-size: 24rpx;
						color: $u-light-color;
						margin-right: 10rpx;
						padding: 0 4rpx;
						border-radius: 2rpx;
					}
				}
			}
	
			.store-seller-name {
				color: #666;
				overflow: hidden;
				display: flex;
				justify-content: space-between;
			}
	
			.count-config {
				padding: 5rpx 0;
				color: #666;
				display: flex;
				font-size: 24rpx;
				justify-content: space-between;
			}
	
			>.price-box {
				margin-top: 10rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-right: 10rpx;
				font-size: 24rpx;
				color: $u-font-color-light;
	
				>.price {
					font-size: 26rpx;
					line-height: 1;
					color: $u-main-color;
					font-weight: bold;
	
					::v-deep span:nth-of-type(1) {
						font-size: 38rpx;
					}
				}
			}
	
		}
</style>
