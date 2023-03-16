<template>
	<view>
		<view class="user-vip">
			<view class="header">
				<view class="user-vip-info row">
					<custom-image width="110rpx" height="110rpx" round :src="userInfo.avatar"></custom-image>
					<view class="ml20 column">
						<view class="user-text white xxl row">{{userInfo.nickname}}</view>
						<view class="user-level white xs row-center">当前等级：{{userInfo.levelName || "无"}}</view>
					</view>
				</view>
			</view>
			<view class="content">
				<view class="vip-swiper-container">
					<swiper class="swiper" style="height: 320rpx" previous-margin="60rpx" next-margin="60rpx" display-multiple-items="1"
					 :current="currentIndex" @change="bindchange">
						<swiper-item v-for="(item, index) in levelList" :key="index">
							<view class="vip-card-item" :style="'background-image: url(' + item.backgroundImage + ');'">
								<view class="row-between">
									<view>
										<view v-if="item.id === userInfo.levelId" class="row grade white sm">当前等级</view>
										<view v-else-if="item.id > userInfo.levelId" class="row white sm ml20">未解锁</view>
										<view v-else-if="item.id < userInfo.levelId" class="row white sm ml20">已解锁</view>
									</view>
									<image class="grade-icon" :src="item.image"></image>
								</view>
								<view class="row-between vip-name white">
									<view class="bold">{{item.name}}</view>
									<view class="sm">{{item.nextLevel}}</view>
								</view>
								<view class="row-center" v-if="item.growth">
									<view class="vip-progress bg-white row">
										<view class="vip-progress-bar" :style="'width: ' + (item.growth*100) + '%'"></view>
									</view>
								</view>
								<view class="row-between mt20" style="padding: 0 30rpx">
									<navigator hover-class="none" class="row">
										<view class="sm white" style="line-height: 36rpx">
											{{'当前成长值' + userInfo.growth}}
										</view>
									</navigator>
									<view class="white">{{item.id > userInfo.levelId ? ('还需' + (item.growthPoint - userInfo.growth) + '可升级') :''}}</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<view class="vip-grade-rule">
					<view class="title row">
						<view class="line br60"></view>
						<view class="xl ml20 bold">成长值规则</view>
					</view>
					<text class="rule-content column lighter ml20">
						连续签到3天，赠送20成长值
					</text>
				</view>
				<view class="vip-rights">
					<view class="title row">
						<view class="line br60"></view>
						<view class="xl ml20 bold">会员权益</view>
					</view>
					<view class="rights-list row">
				<!-- 		<view v-for="(item, index) in privilegeList" :key="index" class="rights-item column-center">
							<image class="mb10" :src="item.image"></image>
							<view class="sm">{{item.name}}</view>
						</view> -->
						<view class="rights-item column-center " v-if="currentLevel.priviledgeFreeFreight">
							<image class="mb10" src="/static/images/icon_free_postage.png"></image>
							<view class="sm">免邮特权</view>
						</view>
						<view class="rights-item column-center " v-if="currentLevel.priviledgeMemberPrice">
							<image class="mb10" src="/static/images/icon_member_price_privilege.png"></image>
							<view class="sm">会员价格特权</view>
						</view>
						<view class="rights-item column-center " v-if="currentLevel.priviledgeBirthday">
							<image class="mb10" src="/static/images/icon_birthday_privileges.png"></image>
							<view class="sm">生日特权</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<loading-view v-if="!userInfo.nickname"></loading-view>
	</view>
</template>

<script lang="ts" setup>
import type { Member,MemberLevel } from "@/models/type.js"
import { getUserDetail,getLevelList } from '@/api/user'
import { ref,reactive, shallowRef,watch } from 'vue'
import { onShow, onUnload } from '@dcloudio/uni-app'

// 用户信息
const userInfo = reactive<Member>({
    id: 0,
	sn: '',
    levelId: 0,
	levelName: '',
    username: '',
	nickname: '',
	mobile: '',
	email: '',
	avatar: '',
	gender: 0,
	birth: '',
	city: '',
	job: '',
	sign: '',
	sourceType: '',
	integration: '',
	growth: '',
	nextLevelTips: '',
	noticeNum: 0,
	status: '',
})
const currentIndex = ref<number>(-1)
const levelList = reactive<MemberLevel[]>([])
const currentLevel = reactive<MemberLevel>({
	id: 0,
	name: '',
	growthPoint: 0,
	defaultStatus: 0,
	freeFreightPoint: 0,
	commentGrowthPoint: 0,
	priviledgeFreeFreight: 0,
	priviledgeMemberPrice: 0,
	priviledgeBirthday: 0,
	note: '',
	image: '',
	backgroundImage: ''
})
// 获取用户信息
const getUser = async () => {
    // userInfo.value = await getUserCenter()
	let data = await getUserDetail()
	Object.assign(userInfo,data)
}
const getLevelListFun = async() => {
	let data = await getLevelList()
	Object.assign(levelList,data)
}
const bindchange = (e: any) =>{
	let {
		current
	} = e.detail
	currentIndex.value = current
	// this.privilegeList = currentLevel.level_privilege
}

watch(
		() => currentIndex.value,
		(newVal) => {
			if(newVal >= 0 && newVal < levelList.length) {
				Object.assign(currentLevel,levelList[newVal])
			}
		}, {
			immediate: true
		}
	)
	
onShow(async () => {
    await getUser()
	await getLevelListFun()
	for (let i = 0; i < levelList.length; i++) {
		  if(levelList[i].id === userInfo.levelId) {
			  currentIndex.value = i
			  break
		  }
	}
})


</script>

<style lang="scss">
	page {
		background-color: #fff;

		.user-vip {
			.header {
				background-image: url(../../static/images/vip_grade_bg.png);
				padding-top: 30rpx;
				background-size: 100% 100%;
				height: 382rpx;

				.user-vip-info {
					padding-left: 30rpx;

					.user-level {
						border: 1px solid white;
						border-radius: 100rpx;
						padding: 4rpx 20rpx;
						line-height: 30rpx;
					}

					.user-text {
						line-height: 50rpx;
						font-weight: bold;
					}
				}
			}

			.content {
				margin-top: -200rpx;

				.vip-card-item {
					height: 320rpx;
					width: 600rpx;
					position: relative;
					background-size: 100% 100%;

					.grade {
						line-height: 36rpx;
						background-color: rgba(0, 0, 0, 0.5);
						border-top-right-radius: 100rpx;
						border-bottom-right-radius: 100rpx;
						height: 50rpx;
						padding: 0 28rpx;
					}

					.user-grade {
						line-height: 36rpx;
						margin-left: 30rpx;
					}

					.grade-icon {
						width: 120rpx;
						height: 100rpx;
					}

					.vip-name {
						padding: 10rpx 30rpx;
						font-size: 46rpx;
						text-align: center;
						align-items: flex-end;
						margin-bottom: 30rpx;
					}

					.vip-progress {
						height: 8rpx;
						width: 540rpx;

						.vip-progress-bar {
							background-color: #f8d07c;
							height: 100%;
						}
					}

				}

				.vip-grade-rule {
					margin: 24rpx 40rpx;

					.title {
						.line {
							width: 8rpx;
							height: 34rpx;
							background-color: #f79c0c;
						}
					}
				}

				.vip-rights {
					margin: 24rpx 40rpx;

					.title {
						padding: 28rpx 0;

						.line {
							width: 8rpx;
							height: 34rpx;
							background-color: #f79c0c;
						}
					}

					.rights-item {
						width: 25%;
						padding-bottom: 30rpx;

						image {
							width: 82rpx;
							height: 82rpx;
						}
					}
				}

			}

		}
	}
</style>
