<template>
<text :style="{color, 'font-weight': weight}" :class="(lineThrough ? 'line-through' : '') + ' price-format'">
    <text v-if="showSubscript" :style="{'font-size': subscriptSize + 'rpx', 'margin-right': '2rpx'}">¥</text>
    <text :style="{'font-size': firstSize + 'rpx', 'margin-right': '1rpx'}">{{priceSlice.first}}</text>
    <text v-if="priceSlice.second" :style="{'font-size': secondSize + 'rpx'}">.{{priceSlice.second}}</text>
</text>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
//分割后的价格显示
const priceSlice = reactive({
	first: '',
	second: ''
})
const props = defineProps({
    firstSize: {
        type: [String, Number],
        default: () => (28)
    },
	secondSize: {
		type: [String, Number],
		default: () => (28)
	},
	color: {
		type: String, 
		default: () => ('')
	},
	weight: {
		type: [String, Number],
		default: () => (400)
	},
	price: {
		type: Number,
		default: () => (NaN)
	},
	showSubscript: {
		type: Boolean,
		default: () => (true)
	},
	subscriptSize: {
	 type: [String, Number],
		default: () => (28)
	},
	lineThrough: {
	 type: Boolean,
		default: () => (false)
	},
})
const priceFormat = () => {
	if(props.price !== null && props.price != NaN && props.price !== undefined) {
		// let price = parseFloat(props.price);
		let arr = String(props.price).split('.');
		priceSlice.first = arr[0];
		priceSlice.second = arr[1];
	}
}
//监听传入价格的变化
watch(() => props.price,
	(newVal) => {
		priceFormat()
	}, { immediate: true })
</script>

<style>
.price-format {
  font-family: Avenir, SourceHanSansCN, PingFang SC, Arial, Hiragino Sans GB, Microsoft YaHei, sans-serif;
}
</style>