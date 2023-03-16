<template>
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

// 高亮显示搜索内容	
const lightSearchStr = (keyword, str) {
	if (!keyword) {
		return str
	} else {
		let unicodes = '';
		for (let i of Array.from(keyword)) {
			unicodes += this.unicode(i) + "|"
		}
		const rule = '(' + unicodes + ')'
		const reg = new RegExp(rule, 'gi');
		return str ? str.replace(reg, matchValue =>
			`<span style="color:${this.lightColor}">${matchValue}</span>`) : ''
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
	
</style>
