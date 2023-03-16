<template>
	<view class="float-tab ~column">
		<navigator class="tab-img" :style="{top: 3*top + 'px'}" hover-class="none" open-type="switchTab"
			url="/pages/index/index">
			<image class="tab-icon" src="/static/images/icon_float_home.png" />
		</navigator>
		<navigator class="tab-img" :style="{top: 2*top + 'px'}" hover-class="none" open-type="navigate"
			url="/pages/bundle/contact_offical/contact_offical">
			<image class="tab-icon" src="/static/images/icon_float_help.png" />
		</navigator>
		<navigator class="tab-img" :style="{top: 1*top + 'px'}" hover-class="none" open-type="switchTab"
			url="/pages/cart/cart">
			<image class="tab-icon" src="/static/images/icon_float_cart.png" />
		</navigator>
		<image style="z-index: 99" :style="{transform: `rotateZ(${showMore ? 135 : 0}deg)`}" class="tab-img" src="/static/images/icon_float_more.png" @click="onChange" />
	</view>
</template>

<script lang="ts" setup>
import {ref,onMounted,watch} from 'vue'
import { getRect } from '@/utils/util'

let height: number;
const top = ref<number>(0)
const showMore = ref<boolean>(false)
onMounted(() => {
	getRect(".tab-img", false, this).then((res: any) => {
		height = res.height
		console.log('height' + height)
	});
})

//切换
const onChange = () => {
	showMore.value = !showMore.value
}

watch(() => showMore.value,
	(newVal) => {
		if(newVal) {
			top.value = height
		} else {
			top.value = 0
		}
	})
</script>

<style lang="scss">
	.float-tab {
		position: fixed;
		right: 16rpx;
		bottom: 200rpx;
		width: 96rpx;
		height: 96rpx;
		z-index: 777;

		.tab-img {
			width: 100%;
			height: 100%;
			position: absolute;
			transition: all .5s;
			.tab-icon {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
