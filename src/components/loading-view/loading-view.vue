<template>
<view :class="'loading ' + ( props.type == 'flex' ? 'flex' : '' )" style="'#fff">
    <loading :color="props.color" :size="props.size"></loading>
</view>
</template>

<script lang="ts" setup>
const props = defineProps({
    type: {
        type: String,
        default: () => ('fixed')
    },
	backgroundColor: {
		type: String,
		default: () => ('#fff')
	},
	color: {
		type: String, 
		default: () => ('')
	},
	size: {
		type: Number,
		default: () => (40)
	}
})
</script>
<style>
.loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loading.flex {
    position: static;
    flex: 1;
    width: 100%;
}
</style>