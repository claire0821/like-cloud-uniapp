<template>
<!-- pages/address_edit/address_edit.wxml -->
<view class="address-edit">
    <form @submit="formSubmit" report-submit="true">
        <view class="form bg-white">
            <view class="form-item row">
                <view class="label">收货人</view>
                <input class="ml10" v-model="address.name" name="name" type="text" placeholder="请填写收货人姓名" />
            </view>
            <view class="form-item row">
                <view class="label">联系方式</view>
                <input class="ml10" name="phone" v-model="address.phone" type="number" placeholder="请填写手机号码"/>
            </view>
            <view @click="showRegion = true">
                <view class="form-item row">
                    <view class="label">所在地区</view>
                    <input class="ml10" name="provinceCityRegion" v-model="address.provinceCityRegion" type="text" placeholder="请选择省、市、区" disabled/>
                    <image class="icon-sm ml10" src="/static/images/arrow_right.png" />
                </view>
            </view>
            <view>
                <u-field 
                v-model="address.detailAddress" 
                type="textarea"
                label="详细地址" 
                placeholder="请填写小区、街道、门牌号等信息"
                :field-style="{flex: 1, 'margin-left': '20rpx', height: '160rpx'}"
                />
            </view>
        </view>
        <view class="mt10 mb10 bg-white check-wrap">
            <radio-group class="row" @click="ChangeIsDefault">
                <radio id="checkbox" style="border-radius: 50%;transform:scale(0.7)" 
				:checked="address.defaultStatus == 1 ? true : false" color="#FF2C3C"/>
                <label for="checkbox">
                    <text>设置为默认</text>
                </label>
            </radio-group>
        </view>
        <button class="my-btn bg-primary white br60" form-type="submit">完成</button>
    </form>
    <u-select v-model="showRegion" mode="mutil-column-auto" @confirm="regionChange" :list="areaList"></u-select>
</view>
</template>

<script lang="ts" setup>
import {ref,reactive,onMounted,computed,nextTick,toRaw} from 'vue'
import {onLoad,onShow,onUnload} from '@dcloudio/uni-app'
import {getAddressDetail,setDefaultAddress,addAddress,editAddress} from '@/api/user'

import {isWeixinClient} from '@/utils/client'
import area from '@/utils/area'

const address = reactive<MemberReceiveAddress>({
	id: 0,
	memberId: 0,
	name: '',
	phone: '',
	postCode: '',
	province: '',
	city: '',
	region: '',
	detailAddress: '',
	areacode: '',
	provinceCityRegion: '',
	defaultStatus: 0,
})
const showRegion = ref<boolean>(false)
const areaList = ref<[]>([])
onLoad((options) => {
	address.id = options.id
	if (options.id) {
	  uni.setNavigationBarTitle({
	    title: '编辑地址'
	  });
	  getOneAddressFun()
	} else {
	  uni.setNavigationBarTitle({
	    title: '添加地址'
	  });
	  getWxAddressFun()
	}
	nextTick(() => {
		Object.assign(areaList.value,area)
	})
})
onUnload(() => {
	uni.removeStorageSync('wxAddress')
})
//地址详情
const getOneAddressFun = async () => {
	let data = await getAddressDetail(address.id)
	Object.assign(address,data)
}
//选择省市区
const regionChange = (region: any) => {
	address.province = region[0].label;
	address.city = region[1].label;
	address.region = region[2].label;
	address.areacode = region[2].value
	address.provinceCityRegion = address.province + " " + address.city + " " + address.region
}
const ChangeIsDefault = () => {
	if (address.defaultStatus == 0) {
	    address.defaultStatus = 1;
	} else {
	  address.defaultStatus = 0;
	}
}
const formSubmit = async() => {
	if (!address.name) return uni.$u.toast('请填写收货人姓名')
	if (!address.phone) return uni.$u.toast('请填写手机号码')
	if (!address.provinceCityRegion) return uni.$u.toast('请选择省、市、区')
	if (!address.detailAddress) return uni.$u.toast('请填写小区、街道、门牌号等信息')
	if(!address.id || address.id <= 0) {
		await addAddress(toRaw(address))
		uni.$u.toast('添加成功')
	} else {
		await editAddress(toRaw(address))
		uni.$u.toast('修改成功')
	}
	uni.navigateBack()
}
const getWxAddressFun = () => {
 // let wxAddress = uni.getStorageSync('wxAddress');
 //      if (!wxAddress) return;
	//   wxAddress = JSON.parse(wxAddress)
 //      let {
 //        userName: contact,
 //        telNumber: telephone,
 //        provinceName: province,
 //        cityName: city,
 //        detailInfo: address
 //      } = wxAddress;
	//   let district = wxAddress.countryName || wxAddress.countyName
 //      hasRegionCode({
 //        province,
 //        city,
 //        district
 //      }).then(res => {
 //        if (res.code == 1) {
 //          if (res.data.province) {
 //            this.region = `${province} ${city} ${district}`;
 //            this.addressObj.contact = contact;
 //            this.addressObj.telephone = telephone
 //            this.addressObj.address = address
 //            this.addressObj.province_id = res.data.province;
 //            this.addressObj.city_id = res.data.city;
 //            this.addressObj.district_id = res.data.district;
 //          }
 //        }
 //      });
}

</script>
<style lang="scss">
/* pages/address_edit/address_edit.wxss */

.address-edit {
    padding-top: 10rpx;
    .form {
        flex: 1;
        .form-item {
            padding: 0 24rpx;
            height: 80rpx;
            &:not(:nth-of-type(3)) {
                border-bottom: $-solid-border;
            }
            .label {
                width: 150rpx;
            }
            input {
                height: 100%;
                flex: 1;
            }
        }
    }
    .check-wrap {
        padding: 20rpx;
    }
    .my-btn {
        margin: 30rpx 26rpx;
        text-align: center;
    }
}

van-field view {
    height: 100%;
}

van-field textarea {
    height: 100% !important;
    padding-top: 10rpx !important;
}

.van-cell {
    padding: 20rpx !important;
}

.van-field__body--textarea, .van-field__input {
    margin-left: 15rpx;
}
</style>