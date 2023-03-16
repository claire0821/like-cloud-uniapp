import request from '@/utils/request'

// 获取当前用户的购物车商品项
export function getCartItems() {
    return request.get({ url: '/cart/getCartItems' })
}

// 添加商品到购物车
export function addCartItem(skuId: number, num :number) {
    return request.get({ url: '/cart/addCartItem', data:{skuId: skuId, num :num} })
}

// 商品是否选中
export function changeCartItemSelected(skuId: number, selected :boolean) {
   return request.get({ url: '/cart/changeCartItemSelected', data:{skuId: skuId, selected :selected} })
}

// 改变商品数量
export function countCartItem(skuId: number, num :number) {
   return request.get({ url: '/cart/countCartItem', data:{skuId: skuId, num :num} })
}

// 删除商品信息
export function deleteCartItem(skuId: number) {
   return request.get({ url: '/cart/deleteCartItem', data:{skuId: skuId} })
}

// 清空购物车
export function clearCartItem() {
   return request.get({ url: '/cart/clearCartItem' })
}
//全选 全不选
export function selectAllCartItem(selected :boolean) {
   return request.get({ url: '/cart/selectAllCartItem',data:{selected :selected} })
}