<template>
<!-- pages/user_address/user_address.wxml -->
<view class="user-address">
        <view class="no-address column-center" v-if="addressList.length == 0">
            <image class="img-null mt20" src="/static/images/address_null.png"></image>
            <view class="sm muted">暂无添加地址，请添加~</view>
        </view>
        <view class="address-list" v-else>
            <radio-group class="radio-group" @change="radioChange">
                <view v-for="(item, index) in addressList" :key="index" class="item bg-white mb20" :data-id="item.id" @tap="onSelect">
                    <view class="address">
                        <view class="consignee md bold">
                            {{item.name}}
                            <text class="phone ml10">{{item.phone}}</text>
                        </view>
                        <view class="lighter sm mt10">
                            {{item.province}} {{item.city}} {{item.region}} {{item.address}}
                        </view>
                    </view>
                    <view class="operation row-between">
                        <view>
                            <radio class="radio row" color="#FF2C3C" :value="item.id" :checked="item.defaultStatus == 1 ? true : false">
                                <text>设为默认</text>
                            </radio>
                        </view>
                        <view class="row-center">
                            <view class="row mr20" @click.stop="editAddress(item.id)">
                                <image class="icon-md mr10" src="/static/images/icon_edit.png"></image>
                                编辑
                            </view>
                            <view class="row ml20" :data-id="item.id" @tap.stop="showSurePop">
                                <image class="icon-md mr10" src="/static/images/icon_del_1.png"></image>
                                删除
                            </view>
                        </view>
                    </view>
                </view>
            </radio-group>
        </view>
        <u-modal 
        id="delete-dialog"
        v-model="deleteSure"
        :showCancelButton="true"
        confirm-text="狠心删除"
        confirm-color="#FF2C3C"
        :show-title="false"
        @confirm="delAddressFun" 
        @cancel="hidePop">
            <view class="column-center tips-dialog">
                <image class="icon-lg" src="/static/images/icon_warning.png"></image>
                <view style="margin-top:30rpx">确认删除该地址吗？</view>
            </view>
        </u-modal>        
    <view class="footer row-between fixed bg-white">
		<!-- #ifdef H5 || MP-WEIXIN -->
        <view class="btn row-center bg-gray br60 mr20" @click="getWxAddressFun" v-if="isWeixin">
            <image class="icon-lg mr10" src="/static/images/icon_wechat.png"></image>
            <text class="md">微信导入</text>
        </view>
		<!-- #endif -->
        <view class="btn bg-primary white md row-center br60" @click="addAddress">新增收货地址</view>
    </view>
</view>
</template>

<script lang="ts" setup>
import {ref,reactive,onMounted,computed} from 'vue'
import {onLoad,onShow} from '@dcloudio/uni-app'
import {getAddress,setDefaultAddress,delBatchAddress} from '@/api/user'

import {isWeixinClient} from '@/utils/client'

const isWeixin = ref<boolean>(false)//是否微信
const deleteSure = ref<boolean>(false)
const addressList = ref<MemberReceiveAddress[]>([])//地址列表
let currentId: number;
onLoad(() => {
	//#ifdef H5
	isWeixin.value = isWeixinClient()
	//#endif
})

onShow(()=> {
	getAddressLists()
})
//获取地址列表
const getAddressLists = async() => {
	addressList.value = await getAddress()
}
//添加地址
const addAddress = () => {
	uni.navigateTo({
        url: '/pages/address_edit/address_edit'
    });
}
//编辑地址
const editAddress = (id: number) => {
	uni.navigateTo({
        url: '/pages/address_edit/address_edit?id=' + id
    });
}

const onSelect = () => {
	uni.navigateBack()
}
//设置默认地址
const radioChange = async (e: any) => {
	let id = e.detail.value
    await setDefaultAddress(id)
	getAddressLists()
}
const showSurePop = (e: any) => {
	deleteSure.value = true
	currentId = e.currentTarget.dataset.id
}
const hidePop = () => {
	deleteSure.value = false
}
//删除
const delAddressFun = async () => {
	await delBatchAddress([currentId])
	getAddressLists()
}
</script>
<style lang="scss">
/* pages/user_address/user_address.wxss */
.user-address {
    padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
	.no-address {
		padding-top: 300rpx;
		text-align: center;
	}
	.address-list {
	    padding: 10rpx 0;
		.item {
		    padding: 0 30rpx;
			.address {
			    padding: 20rpx 0;
			    border-bottom: $-solid-border;
			}
			.operation {
			    height: 80rpx;
			}
		}
	}
	.footer {
	    position: fixed;
	    left: 0;
	    right: 0;
	    bottom: 0;
	    height: 118rpx;
	    padding: 0 30rpx;
		box-sizing: content-box;
		padding-bottom: env(safe-area-inset-bottom);
		.btn {
		    flex: 1;
		    height: 80rpx;
		}
	}
}

.tips-dialog {
    height: 230rpx;
    width: 100%;
}
</style>