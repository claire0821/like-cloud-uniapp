<template>
  <!-- 遮罩层 -->
  <u-popup @close="close" v-model="show" mode="bottom" border-radius="30" height="260rpx">

    <view class="share-title">
      <span>分享至</span>
    </view>
    <view class="share-list">
      <!-- #ifdef MP-WEIXIN -->
      <view class="share-item">
        <button class="share-btn" @click="weChatShare" open-type="share">
          <u-icon color="#04BE02" size="80" name="weixin-fill"></u-icon>微信好友
        </button>
      </view>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <view class="share-item" @click="handleShare(item)" v-for="(item, index) in list" :key="index">
        <u-icon :color="item.color" size="80" :name="item.icon"></u-icon>
        <view>{{ item.title }}</view>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 -->  
      <view class="share-item" @click="copyLink()">
        <u-icon color="#b4aee8" size="80" name="share-fill"></u-icon>
        <view>{{ '复制链接' }}</view>
      </view>
      <!-- #endif -->
    </view>
  </u-popup>
</template>




<script lang="ts" setup>
import { ref,reactive } from 'vue'
import {ShareTypeEnum} from '@/enums/appEnums'
//import { h5Copy } from "@/js_sdk/h5-copy/h5-copy.js";

const shareLink = "https://m-b2b2c.pickmall.cn" //分享地址，也就是在h5中默认的复制地址
const emit = defineEmits<{
    (event: 'close'): void
}>()
const show = ref<boolean>(false)
const list = [{
    color: "#04BE02",
    title: "微信好友",
    icon: "weixin-fill",
    type: 0,
	}, {
    color: "#04BE02",
    title: "朋友圈",
    icon: "weixin-circle-fill",
    type: 1}]
	
const props = defineProps({
	// 分享类型 
    type: {
        type: String,
        default: () => ('')
    },
	productName: {
		type: String,
		default: () => ('')
	},
	thumbnail: {
		type: String,
		default: () => ('')
	},
	link: {
		type: String,
		default: () => ('')
	}
})

const close = () => {
	emit("close");
}
const weChatShare = () => {
	uni.$u.mpShare = {
        title:  shareTitle(), // 默认为小程序名称，可自定义
        path: '', // 默认为当前页面路径，一般无需修改，QQ小程序不支持
        // 分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。
        // 支持PNG及JPG，默认为当前页面的截图
        imageUrl: props.thumbnail ||''
      }
}
//分享标题
const shareTitle = () => {
      let shareTitle;
      if (props.type == ShareTypeEnum.PRODUCT) {
        shareTitle = `[好友推荐]${props.productName}快来跟我一起看看吧`;
      } else if (props.type == ShareTypeEnum.SHOP) {
        shareTitle = `[好友发现]${props.productName}快来跟我一起看看吧`;
      } else if (props.type == ShareTypeEnum.GROUP_BARGAIN) {
        shareTitle = `[好友邀请]${props.productName}快来跟我一起抢购吧!`;
      } else if (props.type == ShareTypeEnum.BARGAIN) {
        shareTitle = `[好友邀请]请快来帮我砍一刀${props.productName}`;
      }
      return shareTitle;
}
 // #ifdef APP-PLUS
const handleShare = (val: any) => {
    if (val.type <= 1) {
      let scene; //  "WXSenceTimeline 朋友圈   WXSceneSession 微信好友"
      val.type == 1
        ? (scene = "WXSenceTimeline")
        : (scene = "WXSceneSession");
      uni.share({
        provider: "weixin",
        scene: scene,
        href: shareLink + props.link,
        imageUrl: props.thumbnail,
        type: 0,
        summary: props.productName,
        title: shareTitle(),
        success: function (res) {
          uni.showToast({
            title: "分享成功!",
            duration: 2000,
            icon: "none",
          });
          emit("close");
        },
        fail: function (err) {
          uni.showToast({
            title: "分享失败!",
            duration: 2000,
            icon: "none",
          });
          emit("close");
        },
      });
    }
}
// #endif

// h5复制链接
// #ifdef H5
const copyLink = () => {
	let content;
    if (props.link) {
      content = shareLink + props.link;
    } else {
      content =
        shareLink +
        getCurrentPages()[getCurrentPages().length - 1].__page__.fullPath;
    }
    if (content === null || content === undefined) {
      content = "";
    } else content = content + "";
    const result = null//h5Copy(content);
    if (result === false) {
      uni.showToast({
        title: "不支持",
      });
    } else {
      uni.showToast({
        title: "复制成功",
        icon: "none",
      });
    }
}
// #endif
</script>


<style lang="scss" scoped>
@import "./share.scss";
.share-title {
  position: relative;
  height: 90rpx;
  font-size: 32rpx;
  line-height: 90rpx;
  text-align: center;
  > .share-close {
    position: absolute;
    right: 0;
    right: 20rpx;
    top: 30rpx;
  }
}
button:after {
  border: none;
}

.share-list {
  padding: 0 32rpx;
  display: flex;
  text-align: center;
  align-items: center;
  > .share-item {
    width: 25%;
    font-size: 24rpx;
    color: #666;
    > * {
      margin: 8rpx 0;
    }
  }
}
</style>