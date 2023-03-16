export interface CheckedProduct {
    skuId: number
    name: string
    desc: string
	img: string
	title: string
	subtitle: string
	price: number
	saleCount: number
	saleAttr: []
    saleValueStr: string
	stock: number
	memberPrice: number
	activityPrice: number
}
//购物车商品项
export interface CartItem {
	spuId: number
	spuName: string
	spuPic: string
	brandId: number
	brandName: string
	categoryId: number
	categoryName: string
    skuId: number
	skuName: string
	skuPic: string
	skuPrice: number
	skuQuantity: number
	skuAttrValues: string[]
	saleValueStr: string
	totalPrice: number
    selected: boolean
	status: number
	showMemberPrice: boolean
	memberPrice: number
	activityPrice: number
}
//购物车
export interface Cart {
    items: CartItem[]
    countNum: number
    countType: number
	totalAmount: number
}

//收货地址
export interface MemberReceiveAddress {
	id: number
    memberId: number
    name: string
    phone: string,
	postCode: string
	province: string
	city: string
	region: string
	detailAddress: string
	areacode: string
	provinceCityRegion: string
	defaultStatus: number
}

//会员详情
export interface Member {
    id: number
	sn: string
    levelId: number
	levelName: string
    username: string
	nickname: string
	mobile: string
	email: string
	avatar: string
	gender: number
	birth: string
	city: string
	job: string
	sign: string
	sourceType: number
	integration: number
	growth: number
	nextLevelTips: string
	noticeNum: number
	waitPay: number
	waitDelivery: number
	waitTake: number
	waitComment: number
	afterSale: number
	status: number
}
//订单
export interface Order {
	member: Member
	address: MemberReceiveAddress//收货地址
    cartItems: CartItem[]
	productCount: number
	note: string
	totalAmount: number
    payAmount: number
	freightAmount: number
	promotionAmount: number
	integrationAmount: number
	couponAmount: number
	discountAmount: number
	integralUse: boolean,
	status: number

}

//导航
export interface DecorateContentItme {
	image: string
	name: string
    link: Link | null
}

export interface Link {
	path: string
	name: string
    type: string
}

export interface OrderType {
	name: string
	type: number
    isShow: boolean
}

export interface NoticeRecordList {
	title: string
	content: string
    img: string
	type: number
}
export interface NoticeRecord {
	userId: number
	title: string
	content: string
	sceneId: number
    img: string
	recipient: number
	sendType: number
	noticeType: number
	extra: string
	type: number
	createTime: string
}

//会员等级
export interface MemberLevel {
    id: number
	name: string
    growthPoint: number
	defaultStatus: number
    freeFreightPoint: number
	commentGrowthPoint: number
	priviledgeFreeFreight: number
	priviledgeMemberPrice: number
	priviledgeBirthday: number
	note: string
	image: string
	backgroundImage: string
}