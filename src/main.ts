import { createSSRApp } from 'vue'
import App from './App.vue'
import plugins from './plugins'
import { setupRouter } from './router'
import './styles/index.scss'
//import mpShare from 'uview-ui/libs/mixin/mpShare.js';

export function createApp() {
    const app = createSSRApp(App)
	
    Promise.resolve().then(() => {
        setupRouter()
    })
    app.use(plugins)
	
	//let mpShare = require('uview-ui/libs/mixin/mpShare.js');
	//app.use(mpShare)//分享
    return {
        app
    }
}
