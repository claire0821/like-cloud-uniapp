<template>
	<view class="bubble-tips-container" :style="{top: top, left: left}">
		<view class="bubble-content row" v-show="showBubble" v-for="item in currentList" :key="item.id">
			<image class="bubble-img" :src="item.user.avatar" />
			<view class="xs">
				{{item.template}}
			</view>
		</view>
	</view>
</template>

<script>
import {onLoad,onShow } from '@dcloudio/uni-app'
import Cache from "@/utils/cache"

// onLoad(() => {
// 	var index = Cache.get("currentIndex") || 0;
// 	var requestTime = Cache.get("requestTime");
// 	var currentTime = new Date();
// 	var currentList = Cache.get("bubbleList") ? JSON.parse(Cache.get("bubbleList")) : [];
// 	if (currentList.length <= 0) {
// 		this.$getBubbleLists();
// 		Cache.set("currentIndex", 0)
// 	} else if (index - currentList.length >= 0) {
// 		Cache.set("currentIndex", 0);
// 		if (this.timer) {
// 			clearInterval(this.timer)
// 			this.timer = null
// 		}
// 		this.fadeUpBubble();
// 	} else if (currentTime.getTime() - requestTime >= this.updateTime) {
// 		this.$getBubbleLists();
// 		Cache.set("currentIndex", 0)
// 	} else {
// 		if (this.timer) {
// 			clearInterval(this.timer);
// 			this.timer = null;
// 		}
// 		this.fadeUpBubble()
// 	}
// }) 

const getLists = () => {
	
}
</script>

<style>
	.bubble-tips-container {
		position: absolute;
		z-index: 98;
	
		.bubble-content {
			padding: 4rpx 20rpx 4rpx 10rpx;
			background-color: rgba(0, 0, 0, 0.7);
			color: white;
			border-radius: 120rpx;
	
			.bubble-img {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}
		}
	}
</style>