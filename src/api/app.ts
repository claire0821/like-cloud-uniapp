import request from '@/utils/request'

//发送短信
export function smsSend(data: any) {
    return request.post({ url: '/sms/send', data: data })
}

export function getConfig() {
    return request.get({ url: '/front/config' })
}

export function getPolicy(data: any) {
    return request.get({ url: '/policy', data: data })
}


// 装修页面
export function getDecorate(data: any) {
    return request.get({ url: '/decorate/pages/detail', data: data })
}
