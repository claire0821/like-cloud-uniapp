import request from '@/utils/request'

/**
 * @description 获取通知列表
 * @return { Promise }
 */
export function getListNotice() {
    return request.get({ url: '/notice/listNotice' })
}

/**
 * @description 获取通知列表
 * @return { Promise }
 */
export function getListNoticeByType(data: Record<string, any>) {
    return request.get({ url: '/notice/listNoticeByType', data: data })
}
