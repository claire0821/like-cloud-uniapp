<template>
	<view class="swiper-wrap">
		<swiper class="swiper" ref="swiper" :autoplay="autoplay" :circular="circular" :interval="interval"
			:duration="duration" @change="swiperChange">
			<block v-for="(item, index) in urls" :key="index">
				<swiper-item @tap="previewImage(index)">
					<view v-if="item.type == 'video'" class="video-wrap">
						<!-- #ifdef H5 || MP-WEIXIN -->
						<video id="myVideo" class="my-video" :enable-progress-gesture="false" :controls="showControls"
							:autoplay="true" :show-progress="true" :show-fullscreen-btn="showControls" :src="item.url"
							:show-center-play-btn="false" @error="videoErrorCallback" :show-play-btn="showControls"
							@play="showPlay = false" @ended="playEnd" @fullscreenchange="fullscreenchange">
						</video>
						<image v-show="showPlay" @tap.stop="play" src="/static/images/icon_play.png" class="icon-play">
						</image>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS -->
						<j-video :url="item.url" height="750rpx" width="750rpx" :poster="urls[1].url"></j-video>
						<!-- #endif -->
					</view>
					<custom-image v-else width="750rpx" height="750rpx" :src="item.url"></custom-image>
				</swiper-item>
			</block>
		</swiper>
		<view class="dots black sm bg-white br60">{{currentSwiper + 1}}/{{urls.length}}</view>
	</view>
</template>

<script lang="ts" setup>
	import {
		reactive,
		ref,
		provide,
		inject,
		watch,
		computed,
		onMounted,
		getCurrentInstance,
		nextTick
	} from 'vue'
	const props = defineProps({
		imgUrls: {
			type: Array,
			default: () => [],
		},
		circular: {
			type: Boolean,
			default: true,
		},
		interval: {
			type: Number,
			default: 3000,
		},
		duration: {
			type: Number,
			default: 500,
		},
		video: {
			type: String,
		}
	})
	const urls = ref <any[]> ([])
	const autoplay = ref < boolean > (true)
	let videoContext: UniNamespace.VideoContext
	const currentSwiper = ref < number > (0)
	const showPlay = ref < boolean > (true)
	const showControls = ref < boolean > (false)
	watch(
		() => props.imgUrls,
		(newVal) => {
			urls.value = newVal.map(item => {
				console.log(item)
				return {
					url: item,
					type: "image"
				}
			});
			console.log(urls)
			if (props.video) {
				urls.value.unshift({
					url: props.video,
					type: "video"
				})
				autoplay.value = false

				nextTick(() => {
					videoContext = uni.createVideoContext('myVideo', this)
				})
			}
		}, {
			immediate: true
		}
	)

	const swiperChange = (e: any) => {
		currentSwiper.value = e.detail.current
	}
	const videoErrorCallback = (err: any) => {
		console.log('err==>', err)
	}
	const playEnd = () => {
		showPlay.value = true;
	}
	const previewImage = (current: number) => {
		console.log('previewImage' + current)
		let index = current
		// #ifdef MP-WEIXIN
		wx.previewMedia({
			current,
			sources: urls.value,
		});
		//#endif
		// #ifdef H5 || APP-PLUS
		if (props.video) {
			index = current - 1
		}
		if (urls.value[current].type == "video") {
			videoContext.requestFullScreen()
		} else {
			console.log('imgUrls' + props.imgUrls)
			uni.previewImage({
				current: index,
				urls: props.imgUrls
			})
		}
		//#endif
	}

	const play = () => {
		videoContext.play()
	}
	const fullscreenchange = (e: any) => {
		const {
			fullScreen
		} = e.detail
		!fullScreen && videoContext.pause()
		showControls.value = fullScreen ? true : false
		showPlay.value = fullScreen ? false : true
	}
</script>

<style>
	.swiper-wrap {
		width: 100%;
		height: 750rpx;
		position: relative;
	}

	.swiper-wrap .swiper {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.swiper-wrap .swiper .slide-image {
		width: 100%;
		height: 100%;
	}

	.swiper-wrap .dots {
		position: absolute;
		right: 24rpx;
		bottom: 24rpx;
		display: flex;
		height: 34rpx;
		padding: 0 15rpx;
	}

	.swiper-wrap .video-wrap {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.swiper-wrap .my-video {
		width: 100%;
		height: 100%;
	}

	.swiper-wrap .icon-play {
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 999;
	}
</style>
