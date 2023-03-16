//菜单主题类型
export enum ThemeEnum {
    LIGHT = 'light',
    DARK = 'dark'
}

// 客户端
export enum ClientEnum {
    MP_WEIXIN = 1, // 微信-小程序
    OA_WEIXIN = 2, // 微信-公众号
    H5 = 3, // H5
    IOS = 5, //苹果
    ANDROID = 6 //安卓
}

export enum SMSEnum {
    LOGIN = 101,
    BIND_MOBILE = 102,
    CHANGE_MOBILE = 103,
    FIND_PASSWORD = 104
}
// 搜索词类型
export enum SearchTypeEnum {
    HISTORY = 'history',
	HOT = 'hot',
	OTHER = 'other'
}

// 用户资料
export enum FieldType {
    NONE = '',
    AVATAR = 'avatar',
    USERNAME = 'username',
    NICKNAME = 'nickname',
    SEX = 'sex'
}

//加载状态类型
export enum LoadTypeEnum {
    MORE = 'more',
    LOADING = 'loading',
	NOMORE ='noMore'
}

// 商品类别展示格式
export enum ProductListShowTypeEnum {
    TWO = 'twoColumns',
	ONE = 'oneColumn'
}

// 商品类别展示格式
export enum ScreenTypeEnum {
    CATEGORY = 'category',
	BRANDS = 'brands',
	ATTRS = 'attrs'
}

// 分享类型
export enum ShareTypeEnum {
    PRODUCT = 'product', //商品
	SHOP = 'shop', //店铺
	GROUP_BARGAIN = 'group bargain',//拼团
	BARGAIN = 'bargain'//砍价
}

// 商品类别展示格式
export enum ProductTypeEnum {
    MATERIAL = 'material', //实物
	VIRTUAL = 'virtual' //虚拟物品
}

// 商品类别展示格式
export enum ProductActivityTypeEnum {
	SECKILL = 1, //秒杀
    GROUP_BARGAIN = 2, //拼团
	NORMAL = 3, //普通
}

// 购物车商品状态
export enum CartItemStatusEnum {
	NORMAL = 1, //正常
    EXPIRED = 0, //已失效
}

// 订单类型
export enum OrderTypeEnum {
	ALL = 1, //全部
    PAY = 2, //待付款
	DELIVERY = 3,//待收货
	FINISH = 4,//已完成
	CLOSE = 5,//已关闭
}

// 订单类型
export enum OrderStatusEnum {
	CREATE_NEW = 0, //待付款
    PAYED = 1, //已付款
	SENDED = 2,//已发货
	RECIEVED = 3,//已完成
	CANCLED = 4,//已关闭
	SERVICING = 5,//售后中
	SERVICED = 6,//售后完成
}

// 订单类型
export enum TypeEnum {
	ORDINARY = 0, //普通订单
    SECKILL = 1, //秒杀订单
	COLLAGE = 2,//拼团订单
	BARGAIN = 3,//砍价订单
}