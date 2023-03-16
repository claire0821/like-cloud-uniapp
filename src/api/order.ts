import request from '@/utils/request'

// 确认订单
export function confirmOrder() {
    return request.get({ url: '/order/confirm' })
}

/**
 * @description 获取订单列表
 * @return { Promise }
 */
export function getOrderList(data: Record<string, any>) {
    return request.get({ url: '/order/list', data: data })
}

// 关闭订单
export function closeOrder(id: number) {
    return request.post({ url: '/order/close', data: {id} })
}

// 删除订单
export function deleteOrder(id: number) {
    return request.post({ url: '/order/delete', data: {id} })
}

// 完成订单
export function completeOrder(id: number) {
    return request.post({ url: '/order/complete', data: {id} })
}

// 完成订单
export function getOrderdDetail(orderSn: string) {
    return request.get({ url: '/order/detail', data: {orderSn} })
}