<template>
	<div>
		<div v-for="(item, index) in res" :key="index" class="product-row" @click="navigateToDetailPage(item)">
			<div class="flex product-col">
				<div class="product-img">
					<u-image width="230rpx" border-radius='16' height="230rpx" :src="item.productImage || item.thumbnail">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</div>
				<div class="product-detail">
					<div class="title clamp3">{{ item.productName }}</div>
					<div class='flex flex-a-c flex-j-sb'>
						<view class="price-box">
							<!-- 秒杀 / 拼团 -->
							<div class="price" v-if="!type && item.price!=undefined">
								¥<span>{{ $options.filters.productFormatPrice(item.price )[0] }} </span>.{{
										$options.filters.productFormatPrice(item.price )[1]
									}}
							</div>
							<!-- 砍价 -->
							<div class="price" v-if="type && item.purchasePrice!=undefined">
								最低：
								¥<span>{{ $options.filters.productFormatPrice(item.purchasePrice )[0] }} </span>.{{
										$options.filters.productFormatPrice(item.purchasePrice )[1]
									}}
							</div>
						</view>
						<div>
							<image class='buy' :src="buy"></image>
						</div>
					</div>
					<div class='count-config' v-if="!type">
						<span>即将恢复{{ item.originalPrice}}元</span>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>


<script lang="ts" setup>
import commonTpl from '@/components/product-list/common'
const props = defineProps({
	// 遍历的数据
    res: {
        type: Array,
        default: () => ([])
    },
    type: {
        type: null,
        default: () => ('')
    }
})
const navigateToDetailPage = (item: any) => {
   if(props.type == 'kanJia'){
   		uni.navigateTo({
   			url: `/pages/promotion/bargain/detail?id=${item.id}`,
   		});
   		return
   	}
   	uni.navigateTo({
   		url: `/pages/product/product?id=${item.skuId}&productId=${item.productId}`,
   	});
}
</script>

<style lang='scss' scoped>
	.buy {
		width: 152rpx;
		height: 108rpx;
	}
	.flex-j-sb {
		width: 100%;
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
			font-size: $font-base;
			color: $font-color-dark;
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
					color: $light-color;
					margin-right: 10rpx;
					padding: 0 4rpx;
					border-radius: 2rpx;
				}
			}
		}

		.count-config {
			padding: 5rpx 0;
			color: #666;
			display: flex;
			font-size: 24rpx;
			letter-spacing:2rpx;
			padding-left: 10rpx;
		}



	}

	.price-box {
		margin-top: 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 10rpx;
		font-size: 24rpx;
		color: $font-color-light;

		>.price {
			font-size: 26rpx;
			line-height: 1;
			color: $main-color;
			font-weight: bold;

			/deep/ span:nth-of-type(1) {
				font-size: 48rpx;
			}
		}
	}
</style>
