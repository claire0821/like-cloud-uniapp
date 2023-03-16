import request from '@/utils/request'

// 商品信息列表
export function getProductList(params?: Record<string, any>) {
    return request.post({ url: '/search/product/list', params })
}

// 获取筛选参数
export function getProduct(data: any) {
    return request.post({ url: '/search/product', data })
}

// 商品信息详情
export function getProductDetail(skuId?: number, spuId? :number) {
    return request.get({ url: `/product/detail?skuId=${skuId}&spuId=${spuId}` })
}

// 热销商品
export function getHotSale() {
    return request.get({ url: '/product/skuinfo/getHotSale'})
}
