import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import postcssRemToResponsivePixel from 'postcss-rem-to-responsive-pixel'
import postcssWeappTailwindcssRename from 'weapp-tailwindcss-webpack-plugin/postcss'
import vwt from 'weapp-tailwindcss-webpack-plugin/vite'

const isH5 = process.env.UNI_PLATFORM === 'h5'
const isApp = process.env.UNI_PLATFORM === 'app'
const weappTailwindcssDisabled = isH5 || isApp

const postcssPlugin = [autoprefixer(), tailwindcss()]
if (!weappTailwindcssDisabled) {
    postcssPlugin.push(
        postcssRemToResponsivePixel({
            rootValue: 32,
            propList: ['*'],
            transformUnit: 'rpx'
        })
    )
    postcssPlugin.push(postcssWeappTailwindcssRename())
}

// https://vitejs.dev/config/
export default defineConfig({
	server: {
	    host: '0.0.0.0',
	    //配置跨域
	    proxy: {
	        '/api': {
	            target: 'http://10.21.0.61:8093/api',
	            changeOrigin: true,
	            rewrite: path => path.replace(/^\/api/, '')
	        }
	    }
	},
    plugins: [uni(), weappTailwindcssDisabled ? undefined : vwt()],
    css: {
        postcss: {
            plugins: postcssPlugin
        }
    }
})
