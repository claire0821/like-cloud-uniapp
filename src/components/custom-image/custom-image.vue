<template>
	<view :style="[viewStyle]" :class="{'custom-image': true, 'image-round': round}" @click="onClick">
		<image v-if="!error" :src="src" :mode="mode" :lazy-load="lazyLoad" class="image" :show-menu-by-longpress="showMenuByLongpress"
		 @load="onLoaded" @error="onErrored"></image>
		<view v-if="loading && showLoading" class="loading-wrap image">
			<slot v-if="useLoadingSlot" name="loading"></slot>
			<u-icon color="#aaa" v-else name="photo-fill" size="45"></u-icon>
		</view>
		<view v-if="error && showError" class="error-wrap image">
			<slot v-if="useErrorSlot" name="error"></slot>
			<u-icon color="#aaa" v-else name="error-circle-fill" size="45"></u-icon>
			<text class="sm">加载失败</text>
		</view>
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
	const emit = defineEmits<{
	    (event: 'load', detail: any): void,
		(event: 'error', detail: any): void,
		(event: 'click', detail: any): void
	}>()
	
	const props = defineProps({
		src: {
			type: String,
		},
		round: Boolean,
		width: {
			type: null
		},
		height: {
			type: null
		},
		radius: null,
		lazyLoad: {
			type: Boolean,
			default: true
		},
		useErrorSlot: Boolean,
		useLoadingSlot: Boolean,
		showMenuByLongpress: Boolean,
		mode: {
			type: String,
			default: 'scaleToFill'
		},
		showError: {
			type: Boolean,
			default: true
		},
		showLoading: {
			type: Boolean,
			default: true
		},
		customStyle: {
		    type: Object,
		    default: () => {}
		}
	})
	const error = ref <boolean> (false)
	const loading = ref <boolean> (true)

	const viewStyle = reactive({
		width: '',
		height: '',
		borderRadius: '',
		overflow: 'hidden'
	})
	const setStyle = () => {
		if (props.width) {
			viewStyle.width = props.width
		}
		
		if (props.height) {
			viewStyle.height = props.height
		}
		
		if (props.radius) {
			viewStyle.overflow = 'hidden'
			viewStyle.borderRadius = props.radius
		}
	
		// if(props.customStyle) {
		//     viewStyle = Object.assign(viewStyle, this.customStyle)
		// }
	}
	watch(
		() => props.src,
		(newVal) => {
			error.value = false
			loading.value = true
		}, {
			immediate: true
		}
	)
	watch(
		() => props.width,
		(newVal) => {
			setStyle()
		}, {
			immediate: true
		}
	)
	watch(
		() => props.height,
		(newVal) => {
			setStyle()
		},  {
			immediate: true
		}
	)

	const onLoaded = (event: any) => {
		loading.value = false
		emit('load', event.detail)
	}
	const onErrored = (event: any) => {
		error.value = false
		loading.value = true
		emit('error', event.detail)
	}
	const onClick = (event: any) => {
		error.value = false
		loading.value = true
		emit('click', event.detail)
	}
</script>


<style lang="scss">
	.custom-image {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		&.image-round {
			overflow: hidden;
			border-radius: 50%;
		}
		.image {
			display: block;
			width: 100%;
			height: 100%;
		}
		
		.loading-wrap,
		.error-wrap {
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: #969799;
			font-size: 28rpx;
			background-color: #f7f8fa;
		}
	}
</style>
