import {isWeixinClient,trottle,tabbarList} from './tools'
import { currentPage } from './util'
export const toLogin = trottle(_toLogin, 1000)
// 去登录
function _toLogin() {
	//#ifdef APP-PLUS || MP-WEIXIN
	uni.navigateTo({
		url: '/pages/login/login'
	});
	//#endif
	//#ifdef  H5
	const pathLogin = 'pages/login/login'
	let path = currentPage().route
	if (path != pathLogin) {
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}
	// #endif
}