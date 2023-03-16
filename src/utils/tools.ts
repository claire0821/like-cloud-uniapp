//节流
export const trottle = (func: any, time = 1000, context: any) => {
	let previous = new Date(0).getTime()
	return function(...args) {
		let now = new Date().getTime()
		if (now - previous > time) {
			func.apply(context, args)
			previous = now
		}
	}
}

// H5复制方法
export function copy(str: string) {
	// #ifdef H5
	let aux = document.createElement("input");
	aux.setAttribute("value", str);
	document.body.appendChild(aux);
	aux.select();
	document.execCommand("copy");
	document.body.removeChild(aux);
	uni.showToast({
		title: "复制成功",
	})
	// #endif

	// #ifndef H5
	uni.setClipboardData({
		data: str.toString(),
	})
	// #endif
}

//菜单跳转
export function menuJump(item: DecorateContentItme) {
	switch (item.type) {
		case "shop":
			// 本地跳转
			uni.switchTab({
				url: item.path
			});
			// uni.navigateTo({
			// 	url: link
			// });
			break;
		case 2:
			// webview
			uni.navigateTo({
				url: "/pages/webview/webview?url=" + link
			});
			break;
		case 3: // tabbar
	}
}
