<template>
  <view class="content">
    <u-navbar :background="navObj" :is-back="false">
      <search ref="search" class="search-input-box" @clickLeft="back" :mode="2" :placeholder="defaultKeyword"
        @search="doSearch(SearchTypeEnum.OTHER,params.keyword)" @confirm="doSearch(SearchTypeEnum.OTHER,params.keyword)" @SwitchType="doSearchSwitch()"
		 v-model="params.keyword" @change="handleChangeKeyWord"
        :isFocusVal="!isShowSeachGoods"></search>
    </u-navbar>
	
	<!-- 热门搜索 历史搜索词语展示模块 -->
	<view class="search-keyword" v-if="!isShowSeachGoods">
	  <div class="keyword-box">
	    <view class="keyword-block add1">
	      <view class="keyword-list-header">
	        <view class="u-tips">热门搜索</view>
	      </view>
	      <view class="keyword keywordBox">
	        <view class="wes" v-for="(keyword, index) in hotKeywordList" @tap="doSearch(SearchTypeEnum.HOT,keyword)" :key="index">
	          {{ keyword }}</view>
	      </view>
	    </view>
	    <view class="keyword-block" v-if="oldKeywordList.length > 0">
	      <view class="keyword-list-header">
	        <view class="u-tips">搜索历史</view>
	      </view>
	      <div class="oldKeyList">
	        <div class="oldKeyItem" v-if="keyword" v-for="(keyword, index) in oldKeywordList" :key="index"
	          @click="doSearch(SearchTypeEnum.HISTORY, keyword)">
	          <span>{{ keyword }} </span>
	        </div>
						
	        <div @click="showMoreOldKeyword" v-if="oldKeywordLength > loadoldKeywordIndex" class="oldKeyItem">展示更多</div>
	      </div>
	    </view>
	
	    <div class="clear mp-iphonex-bottom" @tap="oldKeywordDelete">清空搜索历史</div>
	  </div>
	</view>
	 <!-- 商品列表-->
	<view class="product-content" v-if="isShowSeachGoods">
	  <view class="navbar">
	    <view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">综合排序</view>
	    <view class="nav-item" :class="{ current: filterIndex === 3 }" @click="tabClick(3, 'buyCount')">
	      <text>销量</text>
	      <view class="p-box">
	        <view class="index-nav-arrow">
	          <image class="img" src="/static/search/arrow-up-1.png"
	            v-if="params.sort === 'buyCount' && params.order === 'asc'" mode="aspectFit"></image>
	          <image class="img" src="/static/search/arrow-up.png" v-else mode="aspectFit"></image>
	        </view>
	        <view class="index-nav-arrow">
	          <image class="img" src="/static/search/arrow-down.png"
	            v-if="params.sort === 'buyCount' && params.order === 'desc'" mode="aspectFit"></image>
	          <image class="img" src="/static/search/arrow-down-1.png" v-else mode="aspectFit"></image>
	        </view>
	      </view>
	    </view>
	    <view class="nav-item" :class="{ current: filterIndex === 4 }" @click="tabClick(4, 'price')">
	      <text>价格</text>
	      <view class="p-box">
	        <view class="index-nav-arrow">
	          <image class="img" src="/static/search/arrow-up-1.png"
	            v-if="params.sort === 'price' && params.order === 'asc'" mode="aspectFit"></image>
	          <image class="img" src="/static/search/arrow-up.png" v-else mode="aspectFit"></image>
	        </view>
	        <view class="index-nav-arrow">
	          <image class="img" src="/static/search/arrow-down.png"
	            v-if="params.sort === 'price' && params.order === 'desc'" mode="aspectFit"></image>
	          <image class="img" src="/static/search/arrow-down-1.png" v-else mode="aspectFit"></image>
	        </view>
	      </view>
	    </view>
	    <view class="nav-item" @click="screenPopup=true">筛选</view>
	  </view>
	  <!-- 一行一个商品展示 -->
	  <div v-if="isSWitch">
	    <scroll-view :style="{ height: productListHeight }" enableBackToTop="true" lower-threshold="250"
	      @scrolltolower="loadmore()" scroll-with-animation scroll-y class="scoll-page">
	      <products-list :res='productList' type='oneColumns' :keyword='keyword' />
	      <uni-load-more :status="loadingType" @loadmore="loadmore()"></uni-load-more>
	    </scroll-view>
	  </div>
	  <!-- 一行两个商品展示 -->
	  <div v-if="
	      !isSWitch &&
	      !(productList == [] || productList == '' || productList == null)
	    ">
	    <scroll-view :style="{ height: productListHeight }" scroll-anchoring enableBackToTop="true"
	      @scrolltolower="loadmore()" scroll-with-animation scroll-y lower-threshold="250" class="scoll-page">
					<products-list :res='productList' :keyword='keyword' />
	      <uni-load-more :status="loadingType"></uni-load-more>
	    </scroll-view>
	  </div>
	</view>
	
	<!-- 筛选 -->
	<u-popup border-radius="20" mode="right" width="90%" v-model="screenPopup">
	  <view class="status_bar"></view>
	  <view class="sort-box  ">
	    <view class="sort-list">
	      <view class="sort-item">
	        <view class="sort-title"> 品牌 </view>
	        <view class="flex" v-if="screenData.brands">
	          <view class="sort-brand-item" :key="brandsIndex" v-for="(brand, brandsIndex) in screenData.brands"
	            @click="handleScreen(brand, brandsIndex, ScreenTypeEnum.BRANDS)">
	            <view class="sort-radius" :class="{
	                'sort-active': brand.selected,
	              }">
	              {{ brand.name }}
	            </view>
	          </view>
	        </view>
	        <!-- <u-empty v-else text="暂无品牌" mode="list"></u-empty> -->
	      </view>
	      <view class="sort-item">
	        <view class="sort-title"> 全部分类 </view>
	        <view class="flex" style="flex-wrap: wrap;" v-if="screenData.categories">
	          <view class="sort-brand-item" :key="categoriesIndex"
	            v-for="(category, categoriesIndex) in screenData.categories"
	            @click="handleScreen(category, categoriesIndex, ScreenTypeEnum.CATEGORY)">
	            <view class="sort-radius" :class="{
	                'sort-active': category.selected,
	              }">
	              {{ category.name }}
	            </view>
	          </view>
	        </view>
	        <!-- <u-empty v-else text="暂无分类" mode="list"></u-empty> -->
	      </view>
	    </view>
	    <view class="sort-list">
	      <view class="sort-item">
	        <view class="sort-title"> 价格区间 </view>
	        <view style="display:flex;  margin-top:20rpx;    align-items: center;">
	          <view class="sort-brand-item uinput">
	            <view class="sort-radius">
	              <u-input v-model="params.minPrice" type="number" placeholder="最低价" input-align="center" />
	            </view>
	          </view>
	          <view>-</view>
	          <view class="sort-brand-item uinput">
	            <view class="sort-radius">
	              <u-input v-model="params.maxPrice" type="number" placeholder="最高价" input-align="center" />
	            </view>
	          </view>
	        </view>
	      </view>
	    </view>
	
	    <view class="sort-list" v-if="screenData.attrs">
	      <view class="sort-item" :key="attrIndex" v-for="(attr, attrIndex) in screenData.attrs">
	        <view class="sort-title"> {{ attr.name }} </view>
	        <view class="flex" style="flex-warp:warp" v-if="attr.values">
	          <view class="sort-brand-item" :key="i" v-for="(value, i) in attr.values"
	            @click="handleScreen(attr, i, ScreenTypeEnum.ATTRS)">
	            <view class="sort-radius" :class="{
	                'sort-active': value.selected,
	              }">
	              {{ value.value }}
	            </view>
	          </view>
	        </view>
	      </view>
	    </view>
	
	    <div class="null-view"></div>
	    <view class="sort-btn mp-iphonex-bottom">
	      <view class="sort-btn-repick" @click="handleScreenReset">重置</view>
	      <view class="sort-btn-confim" @click="handleScreenConfim">确定</view>
	    </view>
	  </view>
	</u-popup>
	
	
  </view>
</template>

<script lang="ts" setup>
import { ref,reactive,onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCategoryList } from '@/api/category'
import Search from "@/components/search/search.vue"
import { LoadTypeEnum, SearchTypeEnum,ScreenTypeEnum } from '@/enums/appEnums'
import { getProductList,getProduct } from '@/api/product'
import productsList from '@/components/widgets/product-list/list.vue'

const defaultKeyword = ref<string>('')//默认搜索词
const isKeyword = ref<boolean>(false)
const hotKeywordList = ref<any>([])//热词列表
const oldKeywordList = ref<any>([])//历史搜索列表
const oldKeywordLength = ref<number>(0)//历史搜索最大值
const loadoldKeywordIndex = ref<number>(10)//历史搜索默认展示个数
const keyword = ref<string>('')//搜索词
const isSWitch = ref<boolean>(false)//页面样式切换
const isShowSeachGoods = ref<boolean>(false)//是否显示已检索的商品
const loadingType = ref(LoadTypeEnum.MORE)//
const productList = ref<any>([])
const screenPopup = ref<boolean>(false)//筛选popup
const screenData = ref<any>([])//筛选参数
const minPrice = ref<number>()//最低价
const maxPrice = ref<number>()//最低价
const productListHeight = ref<any>()//商品列表高度
const routerVal = ref<any>() //路由带的值
const params = reactive({
    pageNumber: 1,
    pageSize: 10,
    keyword: '',
	sort: '',
	order: '',
	category: null,
	brands :[],
	minPrice: null,
	maxPrice: null,
	attrs: []
})
//已选择未确认筛选条件
const selectedScreen = reactive({
	brands: [], //多选
	category: null, //单选
	attrs: [],
})
const storageOldKeys = 'OldKeys'

//返回
const back = () => {
	uni.navigateBack({
		delta: 1
	})
}
const blur = () => {
	uni.hideKeyboard()
}
//点击搜索
const doSearch = (type: SearchTypeEnum, val: string) => {
	//判断输入搜索词是否为空或者默认，为空则填充第一个热词，没有热词则为空
	if(val === '请输入搜索商品' || val == '') {
		if(hotKeywordList.value.length > 0) {
			val = hotKeywordList.value[0]
		} else {
			val = ''
		}
	}
	saveKeyword(val); //保存为历史搜索
	isShowSeachGoods.value = true;
	params.keyword = val;
	params.pageNumber = 1;
	params.pageSize = 10;
	loadData();
	if(type == SearchTypeEnum.HISTORY) {
		
	} else if(type == SearchTypeEnum.HOT) {
		
	}
}
//页面样式切换
const doSearchSwitch = () => {
	isSWitch.value = !isSWitch.value
	isShowSeachGoods.value = true
	params.pageNumber = 1
	params.pageSize = 10
	loadData();
}
 //加载商品 ，带下拉刷新和上滑加载
const loadData = async () => {
    loadingType.value = LoadTypeEnum.LOADING;
    productList.value = [];
	const data = await getProduct({...params});
	productList.value = data.products
    //   if (goodsList.data.result.content.length < 10) {
		  // this.loadingType = "noMore";
		  // this.empty = true
	   //  } else {
		  // this.empty = false
	   //  }
    //   goodsList.push(...goodsList.data.result.content);
    initScreenData(data);
    //   uni.hideLoading();
}

//初始化筛选条件
const initScreenData = (data: any) => {
	// screenData.value = await getProductRelated({pageNumber: params.pageNumber, pageSize: params.pageSize,
	// keyword: params.keyword,sort: params.sort,order: params.order})
	//const data = await getProduct(params)
	console.log(data)
	screenData.value.brands = data.brands
	screenData.value.categories = data.categories
	screenData.value.attrs = data.attrs
	console.log(screenData)
}
//重置筛选参数
const handleScreenReset = () => {
	params.pageNumber = 1
	params.pageSize = 10
	params.category = routerVal.category || null
	params.minPrice = null
	params.maxPrice = null
	//分类
	screenData.value.categories.forEach((item: any) => {
		item.selected = false
	})
	//品牌
	screenData.value.brands.forEach((item: any) => {
		item.selected = false
	})
	//属性
	screenData.value.attrs.forEach((item: any) => {
		item.selected = false
		item.values.forEach((value: any) => {
			value.selected = false
		})
	})

	screenPopup.value = false;
	productList.value = [];
	loadData();
}
//根据筛选参数筛选商品
const handleScreenConfim = () => {
	//分类
	screenData.value.categories.forEach((item: any) => {
		if(item.selected) {
			params.category = item.id
		}
	})
	//品牌
	screenData.value.brands.forEach((item: any) => {
		if(item.selected) {
			params.brands.push(item.id)
		}
	})
	//属性
	screenData.value.attrs.forEach((item: any) => {
		let values = []
		item.values.forEach((value: any) => {
			if(value.selected) {
				values.push(value)
			}
		})
		if(values.length > 0) {
			params.attrs.push({id: item.id, values: values})
		}
	})
	console.log(params)
	loadData()
	screenPopup.value = false
	// if(selectedScreen.brands && selectedScreen.brands.length > 0) {
	// 	params.brands = selectedScreen.brands
	// }
}
//选择筛选条件
const handleScreen = (val: any, index: any, type: ScreenTypeEnum) => {
	if(type == ScreenTypeEnum.CATEGORY) {//分类只能选中一个
		if(val.selected) {//取消选中
			val.selected = false
		} else {//取消其他分类的选中
			screenData.value.categories[index].selected = false
			val.selected = true
		}
	} else if(type == ScreenTypeEnum.BRANDS) {
		val.selected = !val.selected
	} else if(type == ScreenTypeEnum.ATTRS){
		console.log(val)
		val.values[index].selected = !val.values[index].selected
		// if(val.values[index].selected) {
		// 	val.values.selected = true
		// } else {
		// 	val.values.selected = true
		// }
	}
}

//initScreenData();

//初始化页面
const init = () => {
	// 加载搜索记录
	loadOldKeyword(loadoldKeywordIndex.value);
	// 加载热词
	//loadHotKeyword();
}
 //搜索控件加载默认搜索关键字
const loadDefaultKeyword = () => {
	if(hotKeywordList.value.length != 0) {
		//有热词加载第一个
		defaultKeyword.value = hotKeywordList.value[0]
	} else {
		//没有热词默认
		defaultKeyword.value = "请输入搜索商品"
	}
}
//加载历史搜索,自动读取本地Storage
const loadOldKeyword = (loadIndex: number) => {
	oldKeywordList.value = [];
	uni.getStorage({
	  key: "OldKeys",
	  success: (res) => {
	    var OldKeys = JSON.parse(res.data);
	    oldKeywordLength.value = OldKeys.length;
	    for (let i = 0; i < loadIndex; i++) {
	      oldKeywordList.push(OldKeys[i]);
	    }
	  },
	});
}
 // 展示更多历史搜索数据
const showMoreOldKeyword = () => {
      loadOldKeyword(oldKeywordLength.value);
}
// 清空历史搜索
const oldKeywordDelete = () => {
    uni.showModal({
        content: '确定清除历史搜索记录？',
        confirmColor: '#4173FF',
        success: ({ cancel }) => {
            if (cancel) return
            oldKeywordList.value = []
            uni.removeStorage({ key: storageOldKeys })
        }
    })
}
//保存搜索词为历史
const saveKeyword = (keyword: string) => {
	if (!keyword) return;
	uni.getStorage({
        key: storageOldKeys,
        success: (res) => {
          var OldKeys = JSON.parse(res.data);
          var findIndex = OldKeys.indexOf(keyword);
          if (findIndex == -1) {
            OldKeys.unshift(keyword);
          } else {
            OldKeys.splice(findIndex, 1);
            OldKeys.unshift(keyword);
          }
          //最多10个纪录
          OldKeys.length > 10 && OldKeys.pop();

          uni.setStorage({
            key: storageOldKeys,
            data: JSON.stringify(OldKeys),
          });
          oldKeywordList.value = OldKeys; //更新历史搜索
        },
        fail: (e) => {
          var OldKeys = [keyword];
          uni.setStorage({
            key: "OldKeys",
            data: JSON.stringify(OldKeys),
          });
          oldKeywordList.value = OldKeys; //更新历史搜索
        },
    });
}
/**
* 加载热门搜索
* 1.5分钟之后更新缓存
* 2.如果有缓存热门关键字则去请求缓存
*/
const loadHotKeyword = () => {
	
}
const handleChangeKeyWord = (val: string) => {
	params.keyword = val
}
onMounted(() => {
 const { windowWidth, windowHeight } = uni.getSystemInfoSync();

    let topHeight = 0;
    let navHeight = 0;

    uni.getSystemInfo({
      success: function (res) {
        // res - 各种参数

        let top = uni.createSelectorQuery().select(".u-navbar");
        top
          .boundingClientRect(function (data) {
            if (data && data.height) {
              //data - 各种参数
              topHeight = data.height; // 获取元素宽度
            }
          })
          .exec();
        let nav = uni.createSelectorQuery().select(".navbar");
        nav
          .boundingClientRect(function (data) {
            if (data && data.height) {
              //data - 各种参数
              navHeight = data.height; // 获取元素宽度
            }
          })
          .exec();
      },
    });
    productListHeight.value = windowHeight - navHeight - topHeight;
    // #ifdef APP-PLUS
    productListHeight.value = productListHeight.value - 100;
    // #endif
    productListHeight.value += "px";
})
</script>
<style lang="scss" scoped>
@import "./search.scss";
</style>
