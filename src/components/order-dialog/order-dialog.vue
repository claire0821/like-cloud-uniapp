<template>
	<u-modal v-model="show" :show-cancel-button	="true" :content="getTipsText" @confirm="onConfirm" confirm-color="#ff2c3c"></u-modal>
</template>

<script lang="ts" setup>
import {ref,onMounted,watch, computed} from 'vue'
import {closeOrder, deleteOrder, completeOrder} from '@/api/order'
const emit = defineEmits<{
    (event: 'refresh'): void
}>()
const show = ref<boolean>(false)
const props = defineProps({
    type: {
      type: Number,
      default: -1
    },
    orderId: {
      type: Number,
      default: -1
    }
})
const onConfirm = async () => {
	switch(props.type) {
		case 0:
			await closeOrder(props.orderId)
			break
		case 1:
			await deleteOrder(props.orderId)
			onRefresh()
			break
		case 2:
			await completeOrder(props.orderId)
			onRefresh()
			break
	}
	
	onRefresh()
	close()
}
const getTipsText = computed(() => {
	switch(props.type) {
		case 0:
			return "确认取消订单吗？"
		case 1:
			return "确认删除订单吗?"
		case 2:
			return "确认收货吗?"
	}
})
const onRefresh = () => {
	emit('refresh')
}
const open = () => {
	show.value = true
}
const close = () => {
	show.value = false
}
</script>
<style>

</style>
