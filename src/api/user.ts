import request from '@/utils/request'

export function getUserCenter(header?: any) {
    return request.get({ url: '/member/member/center', header })
}

// 会员地址
export function getAddress() {
    return request.get({ url: '/member/address/listByMember' })
}

// 会员默认地址
export function setDefaultAddress(id: number) {
    return request.get({ url: '/member/address/setDefaultAddress',data:{id:id} })
}

// 会员地址
export function getAddressDetail(id: number) {
    return request.get({ url: '/member/address/detail',data:{id:id} })
}

// 会员收货地址新增
export function addAddress(address: MemberReceiveAddress) {
    return request.post({ url: '/member/address/add',data:{...address}})
}

// 会员收货地址编辑
export function editAddress(address: MemberReceiveAddress) {
    return request.post({ url: '/member/address/edit',data:{...address}})
}

// 会员地址删除
export function delBatchAddress(data: any) {
    return request.post({ url: '/member/address/delBatch',data })
}

// 个人信息
export function getUserInfo() {
    return request.get({ url: '/user/info' }, { isAuth: true })
}

// 个人编辑
export function userEdit(data: any) {
    return request.post({ url: '/member/member/edit', data }, { isAuth: true })
}

// 绑定手机
export function userBindMobile(data: any, header?: any) {
    return request.post({ url: '/user/bindMobile', data, header }, { isAuth: true })
}

// 微信电话
export function userMnpMobile(data: any) {
    return request.post({ url: '/user/mnpMobile', data }, { isAuth: true })
}
export function userChangePwd(data: any) {
    return request.post({ url: '/user/changePwd', data }, { isAuth: true })
}

//会员信息详情
export function getUserDetail() {
    return request.get({ url: '/member/member/detail' })
}

// 会员等级列表
export function getLevelList() {
    return request.get({ url: '/member/level/listAll'})
}