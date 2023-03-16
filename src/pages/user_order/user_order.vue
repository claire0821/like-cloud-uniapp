<template>
<view class="user-order">
    <tabs :active="active" @change="changeShow" :config="{itemWidth: 150}">
        <tab v-for="(item, index) in order" :key="index" :title="item.name" :name="item.name">
            <order-list v-if="item.isShow" :order-type="item.type" :ref="'order' + item.type"></order-list>
        </tab>
    </tabs>
	<float-tab></float-tab>
</view>
</template>
<script lang="ts" setup>
import {ref,reactive,onMounted,computed} from 'vue'
import {onLoad,onShow} from '@dcloudio/uni-app'
import {OrderTypeEnum} from '@/enums/appEnums'
import type { OrderType } from "@/models/type.js"

const order = reactive<OrderType[]>([])
const active = ref<number>(OrderTypeEnum.ALL)
onLoad((options) => {
	init()
	let type = options.type || OrderTypeEnum.ALL;
	let index = order.findIndex(item => item.type == type)
	changeShow(index);
})

const init = () => {
	order.splice(0,order.length)
	let o1: OrderType = {
		name: '全部',
		type: OrderTypeEnum.ALL,
		isShow: false
	}
	order.splice(0, 0, o1)
	let o2: OrderType = {
		name: '待付款',
		type: OrderTypeEnum.PAY,
		isShow: false
	}
	order.splice(1, 0, o2)
	let o3: OrderType = {
		name: '待收货',
		type: OrderTypeEnum.DELIVERY,
		isShow: false
	}
	order.splice(2, 0, o3)
	let o4: OrderType = {
		name: '已完成',
		type: OrderTypeEnum.FINISH,
		isShow: false
	}
	order.splice(3, 0, o4)
	let o5: OrderType = {
		name: '已关闭',
		type: OrderTypeEnum.CLOSE,
		isShow: false
	}
	order.splice(4, 0, o5)
}
//切换
const changeShow = (index: number) => {
	if(index != -1) {
		active.value = index
		order[index].isShow = true
	}
}

const onPullDownRefresh = () => {
	 this.$refs['order' + order[active].type][0].reflesh()
}
</script>
