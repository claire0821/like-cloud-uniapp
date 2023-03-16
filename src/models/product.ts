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
    levelId: number
    username: string
	nickname: string
	mobile: string
	email: string
	avatar: string
	gender: number
	birth: string
	city: Date
	job: string
	sign: string
	sourceType: number
	integration: number
	growth: number
	status: number
}
//订单
export interface Order {
	member: Member | null
	address: MemberReceiveAddress | null//收货地址
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
	integralUse: boolean

}
