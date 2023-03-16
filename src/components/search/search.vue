<template>
  <view class="serach">
    <view class="left-box" @tap="onClickLeft">
      <u-icon name="arrow-left" size="40" color="#666"></u-icon>
    </view>
    <view class="content" :style="{ 'border-radius': radius + 'px' }">
      <!-- 增加进入输入状态的点击范围 -->
      <view class="content-box" :class="{ center: mode === 2 }">
        <u-icon name="search" size="32" style="padding:0 15rpx;"></u-icon>
        <!-- 增加placeholder input confirm-type confirm-->
        <input style="width:100%; " :placeholder="placeholder" placeholder-class="placeholder-color"
          @input="inputChange" confirm-type="search" @confirm="triggerConfirm" class="input"
          :class="{ center: !active && mode === 2 }" :focus="isFocus" v-model="inputVal" @focus="focus" @blur="blur" />
        <u-icon name="close" v-if="isDelShow" style="padding:0 30rpx;" @click="clear"></u-icon>
      </view>

    </view>
    <view class="button active" >
      <view v-if="isShowSeachGoods !=true" class="button-item">
        <div @click="out()">取消</div>
      </view>

      <view v-else class="button-item">
        <u-icon name="grid-fill" size="50" @click="handelListClass()" v-if="!switchLayout"></u-icon>
        <u-icon v-else @click="handelListClass()" name="list-dot" size="50"></u-icon>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref,onMounted,watch } from 'vue'
const emit = defineEmits<{
    (event: 'SwitchType'): void
	(event: 'confirm', value: boolean): void
	(event: 'input', value: any): void
	(event: 'search', value: string): void
	(event: 'change', value: string): void
	//(event: 'update:keyword', value: string): void
}>()
const props = defineProps({
    mode: {
        type: Number,
        default: () => (1)
    },
//定义默认搜索关键词(水印文字)
    placeholder: {
        type: String,
        default: () => ('请输入搜索内容')
    },
	value: {
		type: String,
		default: () => ('')
	},
	radius: {
		type: String,  // 默认半径为60
		default: () => ('60')
	},
	isFocusVal: {
		type: Boolean,  // 是否获取焦点
		default: () => (true)
	},
	keyword: {
		type: String, 
		default: () => ('')
	}
})

const isShowSeachGoods = ref<boolean>(false)//是否显示查询的商品
const active = ref<boolean>(false) //是否选中
const inputVal = ref<string>('')//Input中内容
const isDelShow = ref<boolean>(false) //是否显示右侧删除icon
const isFocus = ref<boolean>(false)//是否获取焦点
const switchLayout = ref<boolean>(true)//切换当前商品的布局，默认为两列

const out = () => {
	uni.reLaunch({
	    url: "/pages/tabbar/home/index",
	});
}
// 切换排列顺序
const handelListClass = () => {
	switchLayout.value = !switchLayout.value
	emit('SwitchType')
}
// 触发组件confirm事件
const triggerConfirm = () => {
	console.log('inputVal' + inputVal.value)
	emit('confirm', false)
	uni.hideKeyboard()
}
//触发组件input事件
const inputChange = (event: any) => {
	let keyword = event.detail.value
	emit('input', keyword)
	if (inputVal.value) {
	    isDelShow.value = true
	}
}

const focus = () => {
	active.value = true
	if(inputVal.value) {
		isDelShow.value = true
	}
}
	
const blur = () => {
	isFocus.value = false
	if(!inputVal.value) {
		active.value = false
	}
}

const clear = () => {
	//收起键盘
	uni.hideKeyboard()
	isFocus.value = false
	inputVal.value = ''
	active.value = false
	//清空内容时候触发组件input
	emit('input','')
}

//回退到上一级
const onClickLeft = () => {
	uni.navigateBack()
}

//内容为空时，输入默认关键字
const search = () => {
	console.log('inputVal' + inputVal.value)
	emit('search',inputVal.value ? inputVal.value : props.placeholder)
}

onMounted(() => {
    isFocus.value = props.isFocusVal
})

watch(
    () => inputVal.value,
    (newVal) => {
        newVal ? (isDelShow.value = true) : (isDelShow.value = false)
		emit('change',inputVal.value)
		//emit('update:keyword', newVal)
    }
)
</script>

<style lang="scss" scoped>
.serach {
  display: flex;
  width: 100%;
  //border-bottom: 1px #f5f5f5 solid; //HM修改 去掉边框
  box-sizing: border-box;
  font-size: 14px;

  .left-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15%;
    /* #ifndef APP-NVUE */
    text-align: center;
    // display: flex;
    // /* #endif */
  }

  .content {
    display: flex;
    align-items: center;
    width: 100%;
    height: 70rpx;
    color: #999;
    background: #eee;
    overflow: hidden;
    transition: all 0.2s linear;
    .content-box {
      width: 100%;
      display: flex;
      align-items: center;
      &.center {
        justify-content: center;
      }

      .icon {
        padding: 0 15rpx;

        &.icon-serach:before {
          content: "\e61c";
        }
      }

      .input {
        width: 100%;
        max-width: 100%;
        line-height: 60rpx;
        height: 60rpx;
        transition: all 0.2s linear;

        &.center {
          width: 200rpx;
        }

        &.sub {
          // position: absolute;
          width: auto;
          color: grey;
        }
      }
    }
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
    width: 0;
    transition: all 0.2s linear;
    white-space: nowrap;
    overflow: hidden;

    &.active {
      padding-left: 15rpx;
      width: 100rpx;
    }
  }
}

.icon {
  font-family: iconfont;
  font-size: 32rpx;
  font-style: normal;
  color: #999;
}

.placeholder-color {
  color: #999;
  opacity: 0.4;
}
</style>
